package com.umesha_g.the_clique_backend.util.Jwt;

import lombok.Data;
import java.time.LocalDate;

@Data
public class JwtKeyData {
    private final String secretKey;
    private final LocalDate lastGeneratedDate;
}
