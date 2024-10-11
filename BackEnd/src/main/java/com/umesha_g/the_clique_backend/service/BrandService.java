package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.dto.request.BrandRequest;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.model.entity.Brand;
import com.umesha_g.the_clique_backend.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
@RequiredArgsConstructor
public class BrandService {
    private ModelMapper modelMapper;
    private BrandRepository brandRepository;

    @Autowired
    public BrandService(ModelMapper modelMapper, BrandRepository brandRepository) {
        this.modelMapper = modelMapper;
        this.brandRepository = brandRepository;
    }

    public Brand createBrand(BrandRequest request) {
        Brand brand = modelMapper.map(request, Brand.class);
        brand.setCreatedAt(LocalDateTime.now());
        brand.setCreatedBy(SecurityContextHolder.getContext().getAuthentication().getName());
        return brandRepository.save(brand);
    }

    public Brand updateBrand(String id, BrandRequest request) throws ResourceNotFoundException {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found"));

        modelMapper.map(request, brand);
        brand.setUpdatedAt(LocalDateTime.now());
        brand.setUpdatedBy(SecurityContextHolder.getContext().getAuthentication().getName());
        return brandRepository.save(brand);
    }
}