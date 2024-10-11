//package com.umesha_g.the_clique_backend.controller;
//
//import com.umesha_g.the_clique_backend.dto.response.ApiResponse;
//import com.umesha_g.the_clique_backend.model.entity.FileReference;
//import com.umesha_g.the_clique_backend.model.enums.FileEnums.ImageType;
//import com.umesha_g.the_clique_backend.service.FileReferenceService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.util.List;
//import java.util.stream.Collectors;
//import java.util.stream.Stream;
//
//@RestController
//@RequestMapping("/api/v1")
//@RequiredArgsConstructor
//public class ImageController {
//    private final FileReferenceService fileReferenceService;
//
//
//
//
//
//    @DeleteMapping("/reviews/{reviewId}/images/{fileId}")
//    public ResponseEntity<?> deleteReviewImage(
//            @PathVariable String reviewId,
//            @PathVariable String fileId) {
//        try {
//            fileReferenceService.deleteFile(fileId);
//            return ResponseEntity.ok(
//                    new ApiResponse(true, "Image deleted successfully")
//            );
//        } catch (Exception e) {
//            return ResponseEntity.badRequest()
//                    .body(new ApiResponse(false, e.getMessage()));
//        }
//    }
//
//
//}