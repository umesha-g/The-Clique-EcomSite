package com.umesha_g.the_clique_backend.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ReviewResponse {
    //private String id;
    //private String productId;
    //private String userId;
    private String userFirstName;
    private Integer rating;
    private String comment;
    private List<String> imageUrls;
    private LocalDateTime createdAt;
   // private LocalDateTime updatedAt;
}