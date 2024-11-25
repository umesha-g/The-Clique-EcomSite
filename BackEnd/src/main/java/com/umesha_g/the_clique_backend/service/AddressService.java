package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.dto.request.AddressRequest;
import com.umesha_g.the_clique_backend.dto.response.AddressResponse;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.model.entity.Address;
import com.umesha_g.the_clique_backend.model.entity.User;
import com.umesha_g.the_clique_backend.model.enums.AddressType;
import com.umesha_g.the_clique_backend.repository.AddressRepository;
import com.umesha_g.the_clique_backend.repository.UserRepository;
import com.umesha_g.the_clique_backend.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService {
    private AddressRepository addressRepository;
    private  UserRepository userRepository;
    private ModelMapper modelMapper;
    private SecurityUtils securityUtils;

    @Autowired
    public AddressService(AddressRepository addressRepository, UserRepository userRepository, ModelMapper modelMapper, SecurityUtils securityUtils) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
        this.securityUtils = securityUtils;
    }

    @Transactional
    public AddressResponse createAddress(AddressRequest request) throws ResourceNotFoundException {
        User user = securityUtils.getCurrentUser();
        Address address = modelMapper.map(request, Address.class);
        address.setUser(user);
        address.setAddressType(AddressType.HOME);

        if (request.isDefault()) {
            // If this is a default address, unset any existing default
            addressRepository.findByUserIdAndIsDefaultTrue(user.getId())
                    .ifPresent(existingDefault -> {
                        existingDefault.setDefault(false);
                        addressRepository.save(existingDefault);
                    });
        } else if (addressRepository.findByUserIdOrderByIsDefaultDesc(user.getId()).isEmpty()) {
            // If this is the first address, make it default
            address.setDefault(true);
        }

        Address savedAddress = addressRepository.save(address);
        return modelMapper.map(savedAddress, AddressResponse.class);
    }

    public List<AddressResponse> getUserAddresses() throws ResourceNotFoundException {
        User user = securityUtils.getCurrentUser();
        List<Address> addresses = addressRepository.findByUserIdOrderByIsDefaultDesc(user.getId());
        return addresses.stream()
                .map(address -> modelMapper.map(address, AddressResponse.class))
                .collect(Collectors.toList());
    }

    public AddressResponse getAddress(String addressId) throws ResourceNotFoundException {
        User user = securityUtils.getCurrentUser();
        Address address = addressRepository.findByIdAndUserId(addressId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", addressId));
        return modelMapper.map(address, AddressResponse.class);
    }

    @Transactional
    public AddressResponse updateAddress(String addressId, AddressRequest request) throws ResourceNotFoundException {
        User user = securityUtils.getCurrentUser();
        Address address = addressRepository.findByIdAndUserId(addressId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", addressId));

        modelMapper.map(request, address);

        if (request.isDefault()) {
            // If this is being set as default, unset any existing default
            addressRepository.findByUserIdAndIsDefaultTrue(user.getId())
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
    public void deleteAddress(String addressId) throws ResourceNotFoundException {
        User user = securityUtils.getCurrentUser();
        if (!addressRepository.existsByIdAndUserId(addressId, user.getId())) {
            throw new ResourceNotFoundException("Address", "id", addressId);
        }
        addressRepository.deleteById(addressId);

        // If the deleted address was default and other addresses exist, make the first one default
        if (addressRepository.findByUserIdAndIsDefaultTrue(user.getId()).isEmpty()) {
            addressRepository.findByUserIdOrderByIsDefaultDesc(user.getId())
                    .stream()
                    .findFirst()
                    .ifPresent(address -> {
                        address.setDefault(true);
                        addressRepository.save(address);
                    });
        }
    }
}