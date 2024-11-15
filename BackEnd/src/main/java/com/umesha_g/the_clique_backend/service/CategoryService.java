package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.dto.request.CategoryRequest;
import com.umesha_g.the_clique_backend.dto.response.CategoryResponse;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.model.entity.Category;
import com.umesha_g.the_clique_backend.model.entity.Discount;
import com.umesha_g.the_clique_backend.model.entity.Product;
import com.umesha_g.the_clique_backend.repository.CategoryRepository;
import com.umesha_g.the_clique_backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private CategoryRepository categoryRepository;
    private ProductRepository productRepository;
    private ModelMapper modelMapper;
    private DiscountService discountService;
    private DiscountPriorityService discountPriorityService;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository, ProductRepository productRepository, ModelMapper modelMapper, DiscountService discountService, DiscountPriorityService discountPriorityService) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.modelMapper = modelMapper;
        this.discountService = discountService;
        this.discountPriorityService = discountPriorityService;
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest categoryRequest) throws ResourceNotFoundException {
        if (categoryRepository.existsByName(categoryRequest.getName())) {
            throw new RuntimeException("Category with this name already exists");
        }
        Category category = modelMapper.map(categoryRequest,Category.class);

        if(!categoryRequest.getDiscountId().isEmpty()) {
            Discount discount = discountService.getDiscount(categoryRequest.getDiscountId());
            category.setDiscount(discount);
        }
        else {
            category.setDiscount(null);
        }

        Category savedCategory = categoryRepository.save(category);
        return modelMapper.map(savedCategory, CategoryResponse.class);
    }

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(category -> modelMapper.map(category, CategoryResponse.class))
                .collect(Collectors.toList());
    }

    public CategoryResponse getCategoryById(String id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return modelMapper.map(category, CategoryResponse.class);
    }

    @Transactional
    public CategoryResponse updateCategory(String id, CategoryRequest categoryRequest) throws ResourceNotFoundException {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setName(categoryRequest.getName());
        category.setDescription(categoryRequest.getDescription());

        if(!categoryRequest.getDiscountId().isEmpty()) {
            Discount discount = discountService.getDiscount(categoryRequest.getDiscountId());
            category.setDiscount(discount);
        }
        else {
            category.setDiscount(null);
        }

        Category updatedCategory = categoryRepository.save(category);

        List<Product> categoryProducts = productRepository.findByCategory(updatedCategory);
        for (Product product : categoryProducts) {
            discountPriorityService.applyHighestPriorityDiscount(product);
        }
        return modelMapper.map(updatedCategory, CategoryResponse.class);
    }

    @Transactional
    public void deleteCategory(String id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found");
        }
        categoryRepository.deleteById(id);
    }
}