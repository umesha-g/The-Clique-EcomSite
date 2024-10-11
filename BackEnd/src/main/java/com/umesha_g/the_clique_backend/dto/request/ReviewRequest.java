package com.umesha_g.the_clique_backend.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class ReviewRequest {
    private String productId;
    //private String userId;
    private Integer rating;
    private String comment;
    private List<String> imageUrls;
}