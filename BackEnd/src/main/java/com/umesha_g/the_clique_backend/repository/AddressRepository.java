package com.umesha_g.the_clique_backend.repository;

import com.umesha_g.the_clique_backend.model.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, String> {
    List<Address> findByUserUuidOrderByIsDefaultDesc(String userUuid);
    Optional<Address> findByUuidAndUserUuid(String uuid, String userUuid);
    Optional<Address> findByUserUuidAndIsDefaultTrue(String userUuid);
    boolean existsByUuidAndUserUuid(String uuid, String userUuid);
}