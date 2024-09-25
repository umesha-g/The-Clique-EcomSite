package com.umesha_g.store_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.umesha_g.store_backend.model.Address;
import com.umesha_g.store_backend.model.User;

@Repository
public interface AddressRepository extends JpaRepository<Address, String> {
    List<Address> findByUserId(String userId);

    Optional<Address> findByUserAndId(User user, String addressId);

    void deleteByUserAndId(User user, String addressId);
}