package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.dto.request.OrderRequest;
import com.umesha_g.the_clique_backend.dto.response.OrderResponse;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.exception.UnauthorizedException;
import com.umesha_g.the_clique_backend.model.entity.Cart;
import com.umesha_g.the_clique_backend.model.entity.Order;
import com.umesha_g.the_clique_backend.model.entity.OrderItem;
import com.umesha_g.the_clique_backend.model.entity.User;
import com.umesha_g.the_clique_backend.model.enums.NotificationType;
import com.umesha_g.the_clique_backend.model.enums.OrderStatus;
import com.umesha_g.the_clique_backend.repository.OrderRepository;
import com.umesha_g.the_clique_backend.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private OrderRepository orderRepository;
    private  CartService cartService;
    private  NotificationService notificationService;
    private  ModelMapper modelMapper;
    private  SecurityUtils securityUtils;
    private ProductStatisticsService productStatisticsService;

    private PlatformStatisticsService platformStatisticsService;

    @Autowired
    public OrderService(OrderRepository orderRepository, CartService cartService, NotificationService notificationService, ModelMapper modelMapper, SecurityUtils securityUtils, ProductStatisticsService productStatisticsService, PlatformStatisticsService platformStatisticsService) {
        this.orderRepository = orderRepository;
        this.cartService = cartService;
        this.notificationService = notificationService;
        this.modelMapper = modelMapper;
        this.securityUtils = securityUtils;
        this.productStatisticsService = productStatisticsService;
        this.platformStatisticsService = platformStatisticsService;
    }

    @Transactional
    public OrderResponse createOrder(OrderRequest request) throws BadRequestException, ResourceNotFoundException {
        User user = securityUtils.getCurrentUser();
        Cart cart = cartService.getCart();

        if (cart.getCartItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }
        Period period = Period.ofDays(4);
        LocalDate deliveryDate = LocalDate.now().plus(period);

        Order order = new Order();
        order.setId(request.getId());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setUser(user);
        order.setEstimatedDeliveryDate(deliveryDate);
        order.setShippingAddress(user.getAddresses().stream()
                .filter(addr -> addr.getId().equals(request.getAddressId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Address not found")));

        List<OrderItem> orderItems = cart.getCartItems().stream()
                .map(cartItem -> {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setProduct(cartItem.getProduct());
                    orderItem.setSelectedColour(cartItem.getSelectedColour());
                    orderItem.setSelectedSize(cartItem.getSelectedSize());
                    orderItem.setQuantity(cartItem.getQuantity());
                    orderItem.setSubTotal(cartItem.getSubTotal());
                    orderItem.setOrder(order);
                    return orderItem;
                })
                .collect(Collectors.toList());

        order.setOrderItems(orderItems);
        order.setSubTotal(cart.getTotalAmount());
        order.setShippingCost(request.getShippingCost());
        order.setTotalAmount(cart.getTotalAmount().add(request.getShippingCost()));
        order.setStatus(OrderStatus.PENDING);

        Order savedOrder = orderRepository.save(order);

        for(OrderItem item : orderItems){
            productStatisticsService.incrementPurchaseCount(item.getProduct(),item.getQuantity(),item.getSubTotal());
        }

        cartService.clearCart();

        platformStatisticsService.addToTotalRevenue(savedOrder.getTotalAmount());

        String userLink = ("/user/"+user.getId()+"-"+user.getFirstName()+"/order/"+order.getId());

        notificationService.sendUserNotification(user.getId(),
                "Order Placed Successfully",
                "Your Order #" + savedOrder.getId(),
                "has been successfully placed",
                "Estimated Delivery Date: " + savedOrder.getEstimatedDeliveryDate(),
                NotificationType.SUCCESS,
                userLink);

        notificationService.sendAdminNotification(
                "New Order",
                "Order #" + savedOrder.getId(),
                "Estimated Delivery Date: " + savedOrder.getEstimatedDeliveryDate(),
                null,
                NotificationType.SUCCESS,
                null);


        return modelMapper.map(savedOrder, OrderResponse.class);
    }

    @Transactional
    public OrderResponse updateOrderStatus(String orderId, OrderStatus status) throws ResourceNotFoundException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);

        String userLink = ("/user/"+updatedOrder.getUser().getId()+"-"+updatedOrder.getUser().getFirstName()+"/order/"+order.getId());

        notificationService.sendUserNotification(
                updatedOrder.getUser().getId(),
                "Order Updated",
                "Your Order #" + updatedOrder.getId(),
                "has been updated",
                "New Status : " +updatedOrder.getStatus(),
                NotificationType.INFO,
                userLink);

        return modelMapper.map(updatedOrder, OrderResponse.class);
    }

    public OrderResponse getOrder(String id) throws ResourceNotFoundException {
        User user = securityUtils.getCurrentUser();
        Order order = orderRepository.findById(id).orElse(null);
        assert order != null;
        if(order.getUser().getId().equals(user.getId())) {
            return modelMapper.map(order, OrderResponse.class);
        }
        throw new UnauthorizedException("Access Denied!");
    }

    public Page<OrderResponse> getUserOrders(Pageable pageable) throws ResourceNotFoundException {
        User user = securityUtils.getCurrentUser();
        Page<Order> orders = orderRepository.findByUser(user,pageable);
        return orders.map(order -> modelMapper.map(order, OrderResponse.class));
    }

    public Boolean checkOrderIds(String id) {
        return orderRepository.existsById(id);
    }

    public Page<OrderResponse> filterAllOrders(Pageable pageable , String searchTerm, OrderStatus status) {
        Page<Order> orders = orderRepository.findByStatusAndSearch(status, searchTerm, pageable );
        return orders.map(order -> modelMapper.map(order, OrderResponse.class));
    }

    public Page<OrderResponse> searchAllOrders(Pageable pageable , String searchTerm) {
        Page<Order> orders = orderRepository.findByIdContainingIgnoreCase(searchTerm, pageable );
        return orders.map(order -> modelMapper.map(order, OrderResponse.class));
    }
}