package com.umesha_g.the_clique_backend.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "jwt_keys")
@NoArgsConstructor
public class JwtKey {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, unique = true)
    private String secret_key;

    @Column(nullable = false)
    private LocalDate last_generated_date;
}
