package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.dto.request.OrderRequest;
import com.umesha_g.the_clique_backend.dto.response.OrderResponse;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private OrderRepository orderRepository;
    private  CartService cartService;
    private  NotificationService notificationService;
    private  ModelMapper modelMapper;
    private  SecurityUtils securityUtils;

    @Autowired
    public OrderService(OrderRepository orderRepository, CartService cartService, NotificationService notificationService, ModelMapper modelMapper, SecurityUtils securityUtils) {
        this.orderRepository = orderRepository;
        this.cartService = cartService;
        this.notificationService = notificationService;
        this.modelMapper = modelMapper;
        this.securityUtils = securityUtils;
    }

    @Transactional
    public OrderResponse createOrder(OrderRequest request) throws BadRequestException, ResourceNotFoundException {
        User user = securityUtils.getCurrentUser();
        Cart cart = cartService.getCart();

        if (cart.getCartItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }
        Period period = Period.ofDays(3);
        LocalDate deliveryDate = LocalDate.now().plus(period);

        Order order = new Order();
        order.setUser(user);
        order.setEstimatedDeliveryDate(deliveryDate);
        order.setShippingAddress(user.getAddresses().stream()
                .filter(addr -> addr.getId().equals(request.getAddressId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Address not found")));

        // Transform cart items to order items
        List<OrderItem> orderItems = cart.getCartItems().stream()
                .map(cartItem -> {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setProduct(cartItem.getProduct());
                    orderItem.setQuantity(cartItem.getQuantity());
                    orderItem.setSubTotal(cartItem.getProduct().getPrice().multiply(new BigDecimal(cartItem.getQuantity())));
                    orderItem.setOrder(order);
                    return orderItem;
                })
                .collect(Collectors.toList());

        order.setOrderItems(orderItems);
        order.setTotalAmount(cart.getTotalAmount());
        order.setStatus(OrderStatus.PENDING);

        Order savedOrder = orderRepository.save(order);

        // Clear the cart after successful order creation
        cartService.clearCart();

        String message = ("Order Placed Successfully \nTracking Number:" + savedOrder.getTrackingNumber() + "\nEstimated Delivery Date" + savedOrder.getEstimatedDeliveryDate().toString());

        String link = ("/notifications");
        // Send notification to user
        notificationService.sendUserNotification(user.getId(),"New Order",message, NotificationType.NEW_ORDER,link);

        return modelMapper.map(savedOrder, OrderResponse.class);
    }

    @Transactional
    public OrderResponse updateOrderStatus(String orderId, OrderStatus status) throws ResourceNotFoundException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);

        // Send notification about order status update
        notificationService.sendOrderStatusUpdate(updatedOrder);

        return modelMapper.map(updatedOrder, OrderResponse.class);
    }

    public OrderResponse getOrder(String id) throws ResourceNotFoundException, BadRequestException {
        User user = securityUtils.getCurrentUser();
        if (!Objects.equals(user.getCart().getId(), id)) {
            throw new BadRequestException("Access Denied!");
        } else {
            Order order = orderRepository.findById(id).orElse(null);
            return modelMapper.map(order, OrderResponse.class);
        }
    }

    public Page<OrderResponse> getUserOrders(Pageable pageable) throws ResourceNotFoundException {
        User user = securityUtils.getCurrentUser();
        Page<Order> orders = orderRepository.findByUser(user,pageable);
        return orders.map(order -> modelMapper.map(orders, OrderResponse.class));
    }

    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        Page<Order> orders = orderRepository.findAll(pageable);
        return orders.map(order -> modelMapper.map(orders, OrderResponse.class));
    }
}