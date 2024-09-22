package com.umesha_g.store_backend.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {

    @Id
    @Column(unique = true, nullable = false)
    private String id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "full_name")
    private String fullName;

    @OneToMany(mappedBy = "wishlist", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Wishlist> items;

    @OneToMany(mappedBy = "Address", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Address> Address;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // @Column(name = "is_seller")
    // private boolean isSeller;

    // @Column(name = "seller_description")
    // private String sellerDescription;

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<Wishlist> getItems() {
        return items;
    }

    public void setItems(List<Wishlist> items) {
        this.items = items;
    }

    // public String getSellerDescription() {
    // return sellerDescription;
    // }

    // public void setSellerDescription(String sellerDescription) {
    // this.sellerDescription = sellerDescription;
    // }
}
