package com.umesha_g.store_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.umesha_g.store_backend.model.Address;
import com.umesha_g.store_backend.service.AddressService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/addresses")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AddressController {

    @Autowired
    private AddressService addressService;

    @PostMapping
    public ResponseEntity<Address> addAddress(@RequestBody Address address, HttpServletRequest request) {
        Address newAddress = addressService.addAddress(address, request);
        return newAddress != null
                ? new ResponseEntity<>(newAddress, HttpStatus.CREATED)
                : new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PutMapping("/{addressId}")
    public ResponseEntity<Address> updateAddress(@PathVariable String addressId, @RequestBody Address address,
            HttpServletRequest request) {
        Address updatedAddress = addressService.updateAddress(addressId, address, request);
        return updatedAddress != null
                ? ResponseEntity.ok(updatedAddress)
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{addressId}")
    public ResponseEntity<Void> deleteAddress(@PathVariable String addressId, HttpServletRequest request) {
        boolean deleted = addressService.deleteAddress(addressId, request);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<Address>> getUserAddresses(HttpServletRequest request) {
        List<Address> addresses = addressService.getUserAddresses(request);
        return ResponseEntity.ok(addresses);
    }

    @GetMapping("/{addressId}")
    public ResponseEntity<Address> getAddress(@PathVariable String addressId, HttpServletRequest request) {
        Address address = addressService.getAddressById(addressId);
        return address != null
                ? ResponseEntity.ok(address)
                : ResponseEntity.notFound().build();
    }
}