package com.umesha_g.store_backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.umesha_g.store_backend.model.Address;
import com.umesha_g.store_backend.model.User;
import com.umesha_g.store_backend.repository.AddressRepository;
import com.umesha_g.store_backend.util.IdGen;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private IdGen idGen;

    public Address addAddress(String userId, Address address) {
        User user = userService.findById(userId);
        if (user != null) {
            address.setId(idGen.generateId(8, "Address"));
            address.setUser(user);
            address.setCreatedAt(LocalDateTime.now());
            return addressRepository.save(address);
        }
        return null;
    }

    public Address updateAddress(String addressId, Address updatedAddress) {
        return addressRepository.findById(addressId)
                .map(address -> {
                    address.setStreetAddress(updatedAddress.getStreetAddress());
                    address.setCity(updatedAddress.getCity());
                    address.setState(updatedAddress.getState());
                    address.setPostalCode(updatedAddress.getPostalCode());
                    address.setCountry(updatedAddress.getCountry());
                    return addressRepository.save(address);
                })
                .orElse(null);
    }

    public void deleteAddress(String addressId) {
        addressRepository.deleteById(addressId);
    }

    public List<Address> getUserAddresses(String userId) {
        return addressRepository.findByUserId(userId);
    }

    public Address getAddressById(String addressId) {
        return addressRepository.findById(addressId).orElse(null);
    }
}