package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.dto.request.ProductRequest;
import com.umesha_g.the_clique_backend.dto.response.ProductCardResponse;
import com.umesha_g.the_clique_backend.dto.response.ProductResponse;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.model.entity.Brand;
import com.umesha_g.the_clique_backend.model.entity.Category;
import com.umesha_g.the_clique_backend.model.entity.Product;
import com.umesha_g.the_clique_backend.repository.BrandRepository;
import com.umesha_g.the_clique_backend.repository.CategoryRepository;
import com.umesha_g.the_clique_backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service

@RequiredArgsConstructor
public class ProductService {
    private  ProductRepository productRepository;
    private  CategoryRepository categoryRepository;
    private  BrandRepository brandRepository;
    private  ModelMapper modelMapper;

    @Autowired
    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository, BrandRepository brandRepository, ModelMapper modelMapper) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
        this.modelMapper = modelMapper;
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) throws ResourceNotFoundException {
        Product product = modelMapper.map(request, Product.class);

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found"));

        product.setCategory(category);
        product.setBrand(brand);

        Product savedProduct = productRepository.save(product);
        return modelMapper.map(savedProduct, ProductResponse.class);
    }

    public Page<ProductCardResponse> searchProducts(
            String categoryId,
            String brandId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String gender,
            String searchTerm,
            Pageable pageable) {

        Page<Product> products = productRepository.findWithFilters(
                categoryId,
                brandId,
                minPrice,
                maxPrice,
                gender,
                searchTerm,
                pageable
        );

        return products.map(product -> modelMapper.map(product, ProductCardResponse.class));
    }

    @Transactional
    public ProductResponse updateProduct(String id, ProductRequest request) throws ResourceNotFoundException {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        modelMapper.map(request, product);
        Product updatedProduct = productRepository.save(product);
        return modelMapper.map(updatedProduct, ProductResponse.class);
    }

    @Transactional
    public void deleteProduct(String id) throws ResourceNotFoundException {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found");
        }
        productRepository.deleteById(id);
    }

    public Page<ProductResponse> getAllProducts(Pageable pageable , String searchTerm) {
        Page<Product> products = productRepository.findByNameContainingIgnoreCase(searchTerm,pageable);
        return products.map(product -> modelMapper.map(product, ProductResponse.class));
    }

    public ProductResponse getProduct(String id) {
        Product product = productRepository.findById(id).orElse(null);
            return modelMapper.map( product,ProductResponse.class);
    }

    public Page<ProductCardResponse> getAllProductsByCategory(String id , Pageable pageable){
        Category category = null;
        try {
            category = categoryRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        } catch (ResourceNotFoundException e) {
            throw new RuntimeException(e);
        }
        Page<Product> products = productRepository.findByCategory(category,pageable);
        return products.map(product -> modelMapper.map(product,ProductCardResponse.class));
    }

    public Product getProductById (String id){
            return productRepository.findById(id).orElse(null);
    }
}