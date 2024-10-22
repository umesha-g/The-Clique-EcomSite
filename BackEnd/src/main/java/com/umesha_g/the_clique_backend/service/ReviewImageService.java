package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.dto.response.FileRefResponse;
import com.umesha_g.the_clique_backend.dto.response.ReviewResponse;
import com.umesha_g.the_clique_backend.exception.FileExceptions.MaxImagesExceededException;
import com.umesha_g.the_clique_backend.model.entity.FileReference;
import com.umesha_g.the_clique_backend.model.entity.Review;
import com.umesha_g.the_clique_backend.model.enums.FileEnums.ImageType;
import com.umesha_g.the_clique_backend.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewImageService {
    private final FileReferenceService fileReferenceService;
    private final ReviewRepository reviewRepository;
    private final ModelMapper modelMapper;

    private static final int MAX_REVIEW_IMAGES = 4;

    @Transactional
    public void addReviewImages(String reviewId, List<MultipartFile> files) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        // Validate total image count
        List<FileReference> existingImages = fileReferenceService
                .getActiveFilesByEntity(ImageType.REVIEW, reviewId);

        if (existingImages.size() + files.size() > MAX_REVIEW_IMAGES) {
            throw new MaxImagesExceededException(
                    "Maximum review images limit reached. Can only add " +
                            (MAX_REVIEW_IMAGES - existingImages.size()) + " more images."
            );
        }

        // Process each file
        List<String> newImageUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            FileReference fileReference = fileReferenceService.saveFile(
                    file,
                    ImageType.REVIEW,
                    reviewId,
                    false // reviews don't have card images
            );
            newImageUrls.add(fileReference.getStandardUrl());
        }

        // Update review's image URLs
        if (review.getImageUrls() == null) {
            review.setImageUrls(new ArrayList<>());
        }
        review.getImageUrls().addAll(newImageUrls);

        Review updatedReview = reviewRepository.save(review);
        //modelMapper.map(updatedReview, ReviewResponse.class);
    }

    @Transactional
    public ReviewResponse removeReviewImage(String reviewId, String fileReferenceId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        FileReference fileReference = fileReferenceService.getFileReference(fileReferenceId);

        // Remove the URL from review
        review.getImageUrls().remove(fileReference.getStandardUrl());

        // Delete the file
        fileReferenceService.deleteFile(fileReferenceId);

        Review updatedReview = reviewRepository.save(review);
        return modelMapper.map(updatedReview, ReviewResponse.class);
    }

    public List<FileRefResponse> getReviewImages(String reviewId) {
        List<FileReference> files = fileReferenceService.getActiveFilesByEntity(ImageType.REVIEW, reviewId);
        return files.stream()
                .map(fileReference -> modelMapper.map(fileReference, FileRefResponse.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteAllReviewImages(String reviewId) {
        List<FileReference> images = fileReferenceService
                .getActiveFilesByEntity(ImageType.REVIEW, reviewId);

        for (FileReference image : images) {
            fileReferenceService.deleteFile(image.getId());
        }

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        review.setImageUrls(new ArrayList<>());
        reviewRepository.save(review);
    }
}