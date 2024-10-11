package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.dto.request.ReviewRequest;
import com.umesha_g.the_clique_backend.dto.response.ReviewResponse;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.model.entity.Product;
import com.umesha_g.the_clique_backend.model.entity.Review;
import com.umesha_g.the_clique_backend.model.entity.User;
import com.umesha_g.the_clique_backend.repository.ProductRepository;
import com.umesha_g.the_clique_backend.repository.ReviewRepository;
import com.umesha_g.the_clique_backend.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class ReviewService {
    private  ReviewRepository reviewRepository;
    private  ProductRepository productRepository;
    private  ModelMapper modelMapper;
    private  SecurityUtils securityUtils;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository, ProductRepository productRepository, ModelMapper modelMapper, SecurityUtils securityUtils) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.modelMapper = modelMapper;
        this.securityUtils = securityUtils;
    }

    public ReviewResponse createReview(ReviewRequest request) throws ResourceNotFoundException {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        User user = securityUtils.getCurrentUser();

        Review review = modelMapper.map(request, Review.class);
        review.setProduct(product);
        review.setUser(user);

        Review savedReview = reviewRepository.save(review);

        // Update product rating
        updateProductRating(product.getId());

        return modelMapper.map(savedReview, ReviewResponse.class);
    }

    public Page<ReviewResponse> getProductReviews(String productId, Pageable pageable) {
        Page<Review> reviews = reviewRepository.findByProductId(productId, pageable);
        return reviews.map(review -> modelMapper.map(review, ReviewResponse.class));
    }

    public Page<ReviewResponse> getUserReviews(Pageable pageable) throws ResourceNotFoundException {
        String userId = securityUtils.getCurrentUser().getId();
        Page<Review> reviews = reviewRepository.findByUserId(userId, pageable);
        return reviews.map(review -> modelMapper.map(review, ReviewResponse.class));
    }

    public void deleteReview(String id) throws ResourceNotFoundException {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        String productId = review.getProduct().getId();
        reviewRepository.deleteById(id);

        // Update product rating after deletion
        updateProductRating(productId);
    }

    private void updateProductRating(String productId) throws ResourceNotFoundException {
        Double averageRating = reviewRepository.calculateAverageRating(productId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        product.setRating(averageRating != null ? averageRating : 0.0);
        productRepository.save(product);
    }
}