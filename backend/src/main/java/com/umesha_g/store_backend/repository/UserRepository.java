package com.umesha_g.store_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.umesha_g.store_backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

    User findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
