package com.umesha_g.the_clique_backend.controller;

import com.umesha_g.the_clique_backend.dto.request.OrderRequest;
import com.umesha_g.the_clique_backend.dto.response.OrderResponse;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {
    private OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<Page<OrderResponse>> getUserOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy) throws ResourceNotFoundException {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<OrderResponse> response = orderService.getUserOrders(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable String id) throws ResourceNotFoundException {
        return ResponseEntity.ok(orderService.getOrder(id));
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody OrderRequest request) throws BadRequestException, ResourceNotFoundException {
        return new ResponseEntity<>(orderService.createOrder(request), HttpStatus.CREATED);
    }

    @GetMapping("/checkId/{id}")
    ResponseEntity<Boolean> getUserOrderIds(@PathVariable String id) throws ResourceNotFoundException {
        return new ResponseEntity<>(orderService.checkOrderIds(id), HttpStatus.CREATED);
    }


}