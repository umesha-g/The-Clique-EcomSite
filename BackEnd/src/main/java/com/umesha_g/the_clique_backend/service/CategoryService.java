package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.dto.request.CategoryRequest;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.model.entity.Category;
import com.umesha_g.the_clique_backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private ModelMapper modelMapper;
    private CategoryRepository categoryRepository;

    @Autowired
    public CategoryService(ModelMapper modelMapper, CategoryRepository categoryRepository) {
        this.modelMapper = modelMapper;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public Category createCategory(CategoryRequest request) {
        Category category = modelMapper.map(request, Category.class);
        category.setCreatedAt(LocalDateTime.now());
        category.setCreatedBy(SecurityContextHolder.getContext().getAuthentication().getName());
        return categoryRepository.save(category);
    }

    @Transactional
    public Category updateCategory(String id, CategoryRequest request) throws ResourceNotFoundException {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        modelMapper.map(request, category);
        category.setUpdatedAt(LocalDateTime.now());
        category.setUpdatedBy(SecurityContextHolder.getContext().getAuthentication().getName());
        return categoryRepository.save(category);
    }
}