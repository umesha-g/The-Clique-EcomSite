package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.dto.response.ProductResponse;
import com.umesha_g.the_clique_backend.model.entity.Product;
import com.umesha_g.the_clique_backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class ProductImageService {
    private final FileStorageService fileStorageService;
    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;

    @Transactional
    public ProductResponse addProductImage(String productId, MultipartFile file) {
        Product product = productRepository.findById(productId).orElse(null);

        String fileName = fileStorageService.storeFile(file, "product_" + productId);

        if (product.getImageUrls() == null) {
            product.setImageUrls(new ArrayList<>());
        }
        product.getImageUrls().add(fileName);

        Product updatedProduct = productRepository.save(product);
        return modelMapper.map(updatedProduct, ProductResponse.class);
    }

    @Transactional
    public ProductResponse removeProductImage(String productId, String fileName) {
        Product product = productRepository.findById(productId).orElse(null);

        if (product.getImageUrls().remove(fileName)) {
            fileStorageService.deleteFile(fileName);
            Product updatedProduct = productRepository.save(product);
            return modelMapper.map(updatedProduct, ProductResponse.class);

        }
        return null;
    }
}