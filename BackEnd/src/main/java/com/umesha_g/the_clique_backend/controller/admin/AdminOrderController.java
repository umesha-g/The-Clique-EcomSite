package com.umesha_g.the_clique_backend.controller.admin;


import com.umesha_g.the_clique_backend.dto.request.OrderStatusRequest;
import com.umesha_g.the_clique_backend.dto.response.OrderResponse;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/orders")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminOrderController {
    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<Page<OrderResponse>> getAllOrders(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "createdAt") String sortBy) {
            Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
            Page<OrderResponse> response = orderService.getAllOrders(pageable);
            return ResponseEntity.ok(response);
    }
    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable String id,
            @RequestBody OrderStatusRequest request) throws ResourceNotFoundException {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request.getStatus()));
    }
}
