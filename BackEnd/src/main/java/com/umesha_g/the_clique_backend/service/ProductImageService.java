package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.dto.response.FileRefResponse;
import com.umesha_g.the_clique_backend.exception.FileExceptions.MaxImagesExceededException;
import com.umesha_g.the_clique_backend.model.entity.FileReference;
import com.umesha_g.the_clique_backend.model.entity.Product;
import com.umesha_g.the_clique_backend.model.enums.FileEnums.ImageType;
import com.umesha_g.the_clique_backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ProductImageService {
    private  FileReferenceService fileReferenceService;
    private  ProductRepository productRepository;
    private  ModelMapper modelMapper;

    private static final int MAX_PRODUCT_IMAGES = 8;

    @Autowired
    public ProductImageService(FileReferenceService fileReferenceService, ProductRepository productRepository, ModelMapper modelMapper) {
        this.fileReferenceService = fileReferenceService;
        this.productRepository = productRepository;
        this.modelMapper = modelMapper;
    }

    @Transactional
    public void addProductImage(String productId, MultipartFile file, boolean isCardImage) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Validate image count
        List<FileReference> existingImages = fileReferenceService.getActiveFilesByEntity(
                ImageType.PRODUCT_DETAIL, productId);

        if (!isCardImage && existingImages.size() >= MAX_PRODUCT_IMAGES) {
            throw new MaxImagesExceededException("Maximum product images limit reached");
        }

        // Save the file
        FileReference fileReference = fileReferenceService.saveFile(
                file,
                isCardImage ? ImageType.PRODUCT_CARD : ImageType.PRODUCT_DETAIL,
                productId,
                isCardImage
        );

        // Update product's image URLs
        if (isCardImage) {
            product.setCardImageUrl(fileReference.getStandardUrl());
        } else {
            if (product.getDetailImageUrls() == null) {
                product.setDetailImageUrls(List.of(fileReference.getStandardUrl()));
            } else {
                product.getDetailImageUrls().add(fileReference.getStandardUrl());
            }
        }

        Product updatedProduct = productRepository.save(product);
        //modelMapper.map(updatedProduct, ProductResponse.class);
    }

    @Transactional
    public void removeProductImage(String productId, String fileReferenceId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        FileReference fileReference = fileReferenceService.getFileReference(fileReferenceId);

        if (fileReference.isCardImage()) {
            product.setCardImageUrl(null);
        } else {
            product.getDetailImageUrls().remove(fileReference.getStandardUrl());
        }

        fileReferenceService.deleteFile(fileReferenceId);

        Product updatedProduct = productRepository.save(product);
        //modelMapper.map(updatedProduct, ProductResponse.class);
    }

    @Transactional
    public void setAsCardImage(String productId, String fileReferenceId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Convert the image to card image
        FileReference newCardImage = fileReferenceService.convertToCardImage(productId, fileReferenceId);

        // Update product's card image URL
        product.setCardImageUrl(newCardImage.getStandardUrl());

        // Remove the URL from detail images if it exists there
        if (product.getDetailImageUrls() != null) {
            product.getDetailImageUrls().remove(newCardImage.getStandardUrl());
        }

        Product updatedProduct = productRepository.save(product);
       //modelMapper.map(updatedProduct, ProductResponse.class);
    }

    public void removeAllImagesOfAProduct(String productId){
        List<FileReference> cardImages = fileReferenceService
                .getALlFilesByEntity(ImageType.PRODUCT_CARD, productId);
        List<FileReference> detailImages = fileReferenceService
                .getALlFilesByEntity(ImageType.PRODUCT_DETAIL, productId);

        for (FileReference imageRef:detailImages) {
            fileReferenceService.deleteFile(imageRef.getId());
        }
        for (FileReference imageRef:cardImages) {
            fileReferenceService.deleteFile(imageRef.getId());
        }
    }

    public List<FileRefResponse> getProductImages(String productId) {
        List<FileReference> cardImages = fileReferenceService
                .getActiveFilesByEntity(ImageType.PRODUCT_CARD, productId);
        List<FileReference> detailImages = fileReferenceService
                .getActiveFilesByEntity(ImageType.PRODUCT_DETAIL, productId);

        List<FileRefResponse> detailList = detailImages.stream()
                .map(fileReference -> modelMapper.map(fileReference, FileRefResponse.class)).toList();
                //.collect(Collectors.toList());

        List<FileRefResponse> cardList = cardImages.stream()
                .map(fileReference -> modelMapper.map(fileReference, FileRefResponse.class)).toList();
                //.collect(Collectors.toList());

        return Stream.concat(cardList.stream(), detailList.stream())
                .collect(Collectors.toList());
    }
}