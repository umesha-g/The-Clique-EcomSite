package com.umesha_g.the_clique_backend.controller;

import com.umesha_g.the_clique_backend.dto.request.ReviewRequest;
import com.umesha_g.the_clique_backend.dto.response.ReviewResponse;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.model.entity.FileReference;
import com.umesha_g.the_clique_backend.service.ReviewImageService;
import com.umesha_g.the_clique_backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private ReviewService reviewService;
    private ReviewImageService reviewImageService;

    @Autowired
    public ReviewController(ReviewService reviewService, ReviewImageService reviewImageService) {
        this.reviewService = reviewService;
        this.reviewImageService = reviewImageService;
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(@RequestBody ReviewRequest request) throws ResourceNotFoundException {
        return ResponseEntity.ok(reviewService.createReview(request));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<Page<ReviewResponse>> getProductReviews(
            @PathVariable String productId,
            Pageable pageable) {
        return ResponseEntity.ok(reviewService.getProductReviews(productId, pageable));
    }

    @GetMapping("/user/")
    public ResponseEntity<Page<ReviewResponse>> getUserReviews(
            Pageable pageable) throws ResourceNotFoundException {
        return ResponseEntity.ok(reviewService.getUserReviews(pageable));
    }

//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteReview(@PathVariable String id) throws ResourceNotFoundException {
//        reviewService.deleteReview(id);
//        return ResponseEntity.noContent().build();
//    }

    @PostMapping("/reviews/{reviewId}/images")
    public ResponseEntity<?> uploadReviewImages(
            @PathVariable String reviewId,
            @RequestParam("files") List<MultipartFile> files) {

        try {
            reviewImageService.addReviewImages(reviewId,files);
            return ResponseEntity.ok("Review Images Uploaded Successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body( e.getMessage());
        }
    }

    @GetMapping("/reviews/{reviewId}/images")
    public ResponseEntity<List<FileReference>> getReviewImages(
            @PathVariable String reviewId) {
       List<FileReference> files =  reviewImageService.getReviewImages(reviewId);
        return ResponseEntity.ok(files);
    }
}