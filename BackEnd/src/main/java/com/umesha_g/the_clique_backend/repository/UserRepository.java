package com.umesha_g.the_clique_backend.repository;

import com.umesha_g.the_clique_backend.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
//    Page<User> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
//            String name, String email, Pageable pageable
//    );
}
