package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.dto.request.BrandRequest;
import com.umesha_g.the_clique_backend.dto.response.BrandResponse;
import com.umesha_g.the_clique_backend.exception.FileStorageException;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.model.entity.Brand;
import com.umesha_g.the_clique_backend.model.entity.Discount;
import com.umesha_g.the_clique_backend.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class BrandService {
    private ModelMapper modelMapper;
    private BrandRepository brandRepository;
    private FileStorageService fileStorageService;
    private DiscountService discountService;

    @Autowired
    public BrandService(ModelMapper modelMapper, BrandRepository brandRepository, FileStorageService fileStorageService, DiscountService discountService) {
        this.modelMapper = modelMapper;
        this.brandRepository = brandRepository;
        this.fileStorageService = fileStorageService;
        this.discountService = discountService;
    }

    @Transactional
    public BrandResponse createBrand(BrandRequest brandRequest) throws ResourceNotFoundException {
        if (brandRepository.existsByName(brandRequest.getName())) {
            throw new RuntimeException("Brand with this name already exists");
        }
        Discount discount = discountService.getDiscount(brandRequest.getDiscountId());
        Brand brand = modelMapper.map(brandRequest, Brand.class);
        brand.setActive(true);
        brand.setDiscount(discount);

        return brandLogoProcess(brandRequest, brand);
    }


    public List<BrandResponse> getAllBrands() {
        return brandRepository.findAll().stream()
                .map(brand -> modelMapper.map(brand, BrandResponse.class))
                .collect(Collectors.toList());
    }

    public List<BrandResponse> getActiveBrands() {
        return brandRepository.findByIsActiveTrue().stream()
                .map(brand -> modelMapper.map(brand, BrandResponse.class))
                .collect(Collectors.toList());
    }

    public BrandResponse getBrandById(String id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found"));
        return modelMapper.map(brand,BrandResponse.class);
    }

    @Transactional
    public BrandResponse updateBrand(String id, BrandRequest request) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        brand.setName(request.getName());
        brand.setDescription(request.getDescription());
        brand.setActive(request.isActive());

        // Handle logo file update
        return brandLogoProcess(request, brand);
    }

    @Transactional
    public void deleteBrand(String id) {
        if (!brandRepository.existsById(id)) {
            throw new RuntimeException("Brand not found");
        }
        brandRepository.deleteById(id);
    }

    private BrandResponse brandLogoProcess(BrandRequest request, Brand brand) {
        if (request.getLogoFile() != null && !request.getLogoFile().isEmpty()) {
            String prefix = "brand_logo_" + brand.getId();
            String fileName = null;
            try {
                fileName = fileStorageService.storeLogoFile(request.getLogoFile(), prefix);
            } catch (FileStorageException e) {
                throw new RuntimeException(e);
            }
            brand.setLogoUrl("/api/v1/files/brand_logo_" + fileName);
        }
        Brand savedBrand =  brandRepository.save(brand);
        return modelMapper.map(savedBrand,BrandResponse.class);
    }

}