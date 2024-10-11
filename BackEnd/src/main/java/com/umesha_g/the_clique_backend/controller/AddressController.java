package com.umesha_g.the_clique_backend.controller;

import com.umesha_g.the_clique_backend.dto.request.AddressRequest;
import com.umesha_g.the_clique_backend.dto.response.AddressResponse;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/addresses")
@RequiredArgsConstructor
public class AddressController {
    private AddressService addressService;

    @Autowired
    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @PostMapping
    public ResponseEntity<AddressResponse> createAddress(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody AddressRequest request) throws ResourceNotFoundException {
        return new ResponseEntity<>(addressService.createAddress(userId, request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AddressResponse>> getUserAddresses(
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(addressService.getUserAddresses(userId));
    }

    @GetMapping("/{addressId}")
    public ResponseEntity<AddressResponse> getAddress(
            @AuthenticationPrincipal String userId,
            @PathVariable String addressId) throws ResourceNotFoundException {
        return ResponseEntity.ok(addressService.getAddress(userId, addressId));
    }

    @PutMapping("/{addressId}")
    public ResponseEntity<AddressResponse> updateAddress(
            @AuthenticationPrincipal String userId,
            @PathVariable String addressId,
            @Valid @RequestBody AddressRequest request) throws ResourceNotFoundException {
        return ResponseEntity.ok(addressService.updateAddress(userId, addressId, request));
    }

    @DeleteMapping("/{addressId}")
    public ResponseEntity<Void> deleteAddress(
            @AuthenticationPrincipal String userId,
            @PathVariable String addressId) throws ResourceNotFoundException {
        addressService.deleteAddress(userId, addressId);
        return ResponseEntity.noContent().build();
    }
}