package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.dto.request.ProductRequest;
import com.umesha_g.the_clique_backend.dto.response.ProductCardResponse;
import com.umesha_g.the_clique_backend.dto.response.ProductResponse;
import com.umesha_g.the_clique_backend.dto.response.ProductSlugResponse;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.model.entity.Brand;
import com.umesha_g.the_clique_backend.model.entity.Category;
import com.umesha_g.the_clique_backend.model.entity.Discount;
import com.umesha_g.the_clique_backend.model.entity.Product;
import com.umesha_g.the_clique_backend.model.enums.Gender;
import com.umesha_g.the_clique_backend.repository.BrandRepository;
import com.umesha_g.the_clique_backend.repository.CategoryRepository;
import com.umesha_g.the_clique_backend.repository.DiscountRepository;
import com.umesha_g.the_clique_backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service

@RequiredArgsConstructor
public class ProductService {
    private  ProductRepository productRepository;
    private  CategoryRepository categoryRepository;
    private  BrandRepository brandRepository;
    private  DiscountRepository discountRepository;
    private  ModelMapper modelMapper;
    private DiscountPriorityService discountPriorityService;
    private ProductImageService productImageService;
    private PlatformStatisticsService platformStatisticsService;

    @Autowired
    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository, BrandRepository brandRepository, DiscountRepository discountRepository, ModelMapper modelMapper, DiscountPriorityService discountPriorityService, ProductImageService productImageService, PlatformStatisticsService platformStatisticsService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
        this.discountRepository = discountRepository;
        this.modelMapper = modelMapper;
        this.discountPriorityService = discountPriorityService;
        this.productImageService = productImageService;
        this.platformStatisticsService = platformStatisticsService;
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) throws ResourceNotFoundException {
        Product product = modelMapper.map(request, Product.class);
        Product proceededProduct = advancedDetailsProcess(product,request);
        Product savedProduct = discountPriorityService.applyHighestPriorityDiscount(proceededProduct);
        platformStatisticsService.incrementTotalProducts();
        return modelMapper.map(savedProduct, ProductResponse.class);
    }

    public Page<ProductCardResponse> searchProducts(
            String categoryId,
            String brandId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Gender gender,
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
        Product proceededProduct = advancedDetailsProcess(product,request);
        Product updatedProduct = discountPriorityService.applyHighestPriorityDiscount(proceededProduct);
        return modelMapper.map(updatedProduct, ProductResponse.class);
    }

    @Transactional
    public void deleteProduct(String id) throws ResourceNotFoundException {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found");
        }
        productImageService.removeAllImagesOfAProduct(id);
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

    public List<ProductSlugResponse> getAllProductSlugs() {
        return productRepository.findAll().stream()
                .map(product -> new ProductSlugResponse(
                        product.getId(),
                        product.getName())
                ).collect(Collectors.toList());
    }

    public Map<String, BigDecimal> getPriceRange() {
        Pair<BigDecimal, BigDecimal> priceRange = productRepository.findPriceRange();
        Map<String, BigDecimal> response = new HashMap<>();
        response.put("minPrice", priceRange.getFirst());
        response.put("maxPrice", priceRange.getSecond());
        return response;
    }

    public Product getProductById (String id){
            return productRepository.findById(id).orElse(null);
    }

    public List<ProductCardResponse> getRelatedProducts(String productId, int limit) throws ResourceNotFoundException {
        Product currentProduct = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Pageable pageable = PageRequest.of(0, limit);

        List<Product> relatedProducts = productRepository.findRelatedProductsByCategoryRandomly(
                currentProduct.getCategory().getId(),
                productId,
                pageable
        );

        return relatedProducts.stream()
                .map(product -> modelMapper.map(product, ProductCardResponse.class))
                .collect(Collectors.toList());
    }

    public Page<ProductCardResponse> getProductsByDiscountRange(
            Double minDirectDiscount,
            Double maxDirectDiscount,
            Double minOtherDiscount,
            Double maxOtherDiscount,
            int page,
            int size,
            String sortBy
    ) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(sortBy != null ? sortBy : "createdAt").descending()
        );

        Page<Product> productPage = productRepository.findProductsByDiscountRange(
                minDirectDiscount,
                maxDirectDiscount,
                minOtherDiscount,
                maxOtherDiscount,
                pageable
        );

        return productPage.map(product -> modelMapper.map(product, ProductCardResponse.class));
    }

    public List<String> getProductNameSuggestions(String searchTerm) {
        return productRepository.findTop5ProductNameSuggestions(searchTerm);
    }

    private Product advancedDetailsProcess (Product product, ProductRequest request) throws ResourceNotFoundException {

        if(!request.getCategoryId().isEmpty())
        {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            product.setCategory(category);
        }

        if(!request.getBrandId().isEmpty()) {
            Brand brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new ResourceNotFoundException("Brand not found"));
            product.setBrand(brand);
        }

        if(!request.getDiscountId().isEmpty()) {
            Discount discount = discountRepository.findById(request.getDiscountId())
                    .orElseThrow(() -> new ResourceNotFoundException("Discount not found"));
            product.setDirectDiscount(discount);
        }
        return product;
    }
}