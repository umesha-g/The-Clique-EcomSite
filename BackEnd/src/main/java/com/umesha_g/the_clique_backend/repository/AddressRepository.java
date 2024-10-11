package com.umesha_g.the_clique_backend.repository;

import com.umesha_g.the_clique_backend.model.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, String> {
    List<Address> findByUserIdOrderByIsDefaultDesc(String userId);
    Optional<Address> findByIdAndUserId(String id, String userId);
    Optional<Address> findByUserIdAndIsDefaultTrue(String userId);
    boolean existsByIdAndUserId(String id, String userId);
}