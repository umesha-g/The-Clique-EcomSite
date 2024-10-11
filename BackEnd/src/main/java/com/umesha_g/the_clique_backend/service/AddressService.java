package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.dto.request.AddressRequest;
import com.umesha_g.the_clique_backend.dto.response.AddressResponse;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.model.entity.Address;
import com.umesha_g.the_clique_backend.model.entity.User;
import com.umesha_g.the_clique_backend.repository.AddressRepository;
import com.umesha_g.the_clique_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService {
    private AddressRepository addressRepository;
    private  UserRepository userRepository;
    private ModelMapper modelMapper;

    @Autowired
    public AddressService(AddressRepository addressRepository, UserRepository userRepository, ModelMapper modelMapper) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
    }

    @Transactional
    public AddressResponse createAddress(String userId, AddressRequest request) throws ResourceNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Address address = modelMapper.map(request, Address.class);
        address.setUser(user);
        address.setCreatedAt(LocalDateTime.now());
        address.setUpdatedAt(LocalDateTime.now());

        if (request.isDefault()) {
            // If this is a default address, unset any existing default
            addressRepository.findByUserIdAndIsDefaultTrue(userId)
                    .ifPresent(existingDefault -> {
                        existingDefault.setDefault(false);
                        addressRepository.save(existingDefault);
                    });
        } else if (addressRepository.findByUserIdOrderByIsDefaultDesc(userId).isEmpty()) {
            // If this is the first address, make it default
            address.setDefault(true);
        }

        Address savedAddress = addressRepository.save(address);
        return modelMapper.map(savedAddress, AddressResponse.class);
    }

    public List<AddressResponse> getUserAddresses(String userId) {
        List<Address> addresses = addressRepository.findByUserIdOrderByIsDefaultDesc(userId);
        return addresses.stream()
                .map(address -> modelMapper.map(address, AddressResponse.class))
                .collect(Collectors.toList());
    }

    public AddressResponse getAddress(String userId, String addressId) throws ResourceNotFoundException {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", addressId));
        return modelMapper.map(address, AddressResponse.class);
    }

    @Transactional
    public AddressResponse updateAddress(String userId, String addressId, AddressRequest request) throws ResourceNotFoundException {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", addressId));

        modelMapper.map(request, address);
        address.setUpdatedAt(LocalDateTime.now());

        if (request.isDefault()) {
            // If this is being set as default, unset any existing default
            addressRepository.findByUserIdAndIsDefaultTrue(userId)
                    .ifPresent(existingDefault -> {
                        if (!existingDefault.getId().equals(addressId)) {
                            existingDefault.setDefault(false);
                            addressRepository.save(existingDefault);
                        }
                    });
        }

        Address updatedAddress = addressRepository.save(address);
        return modelMapper.map(updatedAddress, AddressResponse.class);
    }

    @Transactional
    public void deleteAddress(String userId, String addressId) throws ResourceNotFoundException {
        if (!addressRepository.existsByIdAndUserId(addressId, userId)) {
            throw new ResourceNotFoundException("Address", "id", addressId);
        }
        addressRepository.deleteById(addressId);

        // If the deleted address was default and other addresses exist, make the first one default
        if (addressRepository.findByUserIdAndIsDefaultTrue(userId).isEmpty()) {
            addressRepository.findByUserIdOrderByIsDefaultDesc(userId)
                    .stream()
                    .findFirst()
                    .ifPresent(address -> {
                        address.setDefault(true);
                        addressRepository.save(address);
                    });
        }
    }
}