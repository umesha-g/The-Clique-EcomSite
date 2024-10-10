package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.dto.request.OrderRequest;
import com.umesha_g.the_clique_backend.dto.response.OrderResponse;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.model.entity.Cart;
import com.umesha_g.the_clique_backend.model.entity.Order;
import com.umesha_g.the_clique_backend.model.entity.OrderItem;
import com.umesha_g.the_clique_backend.model.entity.User;
import com.umesha_g.the_clique_backend.model.enums.OrderStatus;
import com.umesha_g.the_clique_backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final UserService userService;
    private final NotificationService notificationService;
    private final ModelMapper modelMapper;

    public OrderResponse createOrder(OrderRequest request) throws BadRequestException, ResourceNotFoundException {
        User user = userService.getCurrentUser();
        Cart cart = cartService.getUserCart();

        if (cart.getCartItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        Order order = new Order();
        order.setUser(user);
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
                    orderItem.setPrice(cartItem.getProduct().getPrice());
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

        // Send notification to user
        notificationService.sendOrderConfirmation(savedOrder);

        return modelMapper.map(savedOrder, OrderResponse.class);
    }

    public OrderResponse updateOrderStatus(String orderId, OrderStatus status) throws ResourceNotFoundException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);

        // Send notification about order status update
        notificationService.sendOrderStatusUpdate(updatedOrder);

        return modelMapper.map(updatedOrder, OrderResponse.class);
    }
}