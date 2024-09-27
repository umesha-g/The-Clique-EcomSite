package com.umesha_g.store_backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.umesha_g.store_backend.model.Address;
import com.umesha_g.store_backend.model.User;
import com.umesha_g.store_backend.repository.AddressRepository;
import com.umesha_g.store_backend.util.CookieUtil;
import com.umesha_g.store_backend.util.IdGen;
import com.umesha_g.store_backend.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private IdGen idGen;

    @Autowired
    private CookieUtil cookieUtil;

    @Autowired
    private JwtUtil jwtUtil;

    private User getUserFromRequest(HttpServletRequest request) {
        String token = cookieUtil.getTokenFromCookie(request);
        if (token == null) {
            throw new RuntimeException("Authentication token not found");
        }
        String email = jwtUtil.extractEmail(token);
        return userService.findByEmail(email);
    }

    public Address addAddress(Address address, HttpServletRequest request) {
        User user = getUserFromRequest(request);
        if (user != null) {
            address.setId(idGen.generateId("Address"));
            address.setUser(user);
            address.setCreatedAt(LocalDateTime.now());
            return addressRepository.save(address);
        }
        return null;
    }

    public Address updateAddress(String addressId, Address updatedAddress, HttpServletRequest request) {
        User user = getUserFromRequest(request);
        return addressRepository.findById(addressId)
                .map(address -> {
                    if (address.getUser().equals(user)) {
                        address.setStreetAddress(updatedAddress.getStreetAddress());
                        address.setCity(updatedAddress.getCity());
                        address.setState(updatedAddress.getState());
                        address.setPostalCode(updatedAddress.getPostalCode());
                        address.setCountry(updatedAddress.getCountry());
                        return addressRepository.save(address);
                    }
                    return null;
                })
                .orElse(null);
    }

    public boolean deleteAddress(String addressId, HttpServletRequest request) {
        User user = getUserFromRequest(request);
        Address address = findAddressById(addressId);

        if (user != null && address != null) {
            addressRepository.deleteByUserAndId(user, addressId);
            return true;
        }
        return false;

    }

    public List<Address> getUserAddresses(HttpServletRequest request) {
        User user = getUserFromRequest(request);
        if (user != null) {
            return addressRepository.findByUserId(user.getId());
        }
        return List.of();
    }

    public Address findAddressById(String addressId) {
        // User user = getUserFromRequest(request);
        return addressRepository.findById(addressId).orElse(null);
        // .filter(address -> address.getUser().equals(user))
        // .orElse(null);
    }
}