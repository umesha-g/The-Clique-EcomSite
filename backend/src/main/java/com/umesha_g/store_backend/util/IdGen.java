package com.umesha_g.store_backend.util;

import java.security.SecureRandom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.umesha_g.store_backend.service.AddressService;
import com.umesha_g.store_backend.service.ProductService;
import com.umesha_g.store_backend.service.UserService;

@Component
public class IdGen {

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    @Autowired
    private AddressService addressService;

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private final SecureRandom random = new SecureRandom();

    public String generateId(int idLength, String serviceName) {
        String id;
        do {
            id = generateRandomString(idLength);
        } while (idExists(id, serviceName));
        return id;
    }

    private String generateRandomString(int length) {
        StringBuilder idBuilder = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int index = random.nextInt(CHARACTERS.length());
            idBuilder.append(CHARACTERS.charAt(index));
        }
        return idBuilder.toString();
    }

    private boolean idExists(String id, String serviceName) {
        return switch (serviceName) {
            case "User" -> userService.findById(id) != null;
            case "Product" -> productService.findById(id) != null;
            case "Address" -> addressService.getAddressById(id) != null;
            default -> throw new IllegalArgumentException("Invalid service name: " + serviceName);
        };
    }
}