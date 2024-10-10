package com.umesha_g.the_clique_backend.dto.response;

import lombok.Data;

@Data
public class AddressResponse {
    private String id;
    private String receiverName;
    private String phoneNumber;
    private String addressLine;
    private String city;
    private String province;
    private String postalCode;
    private String country;
    private boolean isDefault;
}