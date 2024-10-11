package com.umesha_g.the_clique_backend.repository;

import com.umesha_g.the_clique_backend.model.entity.User;
import com.umesha_g.the_clique_backend.model.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist,String> {

    Optional<Wishlist> findByUser(User user);
}
