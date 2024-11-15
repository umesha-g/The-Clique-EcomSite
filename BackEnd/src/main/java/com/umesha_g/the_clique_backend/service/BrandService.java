package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.dto.request.BrandRequest;
import com.umesha_g.the_clique_backend.dto.response.BrandResponse;
import com.umesha_g.the_clique_backend.exception.FileStorageException;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.model.entity.Brand;
import com.umesha_g.the_clique_backend.model.entity.Discount;
import com.umesha_g.the_clique_backend.model.entity.Product;
import com.umesha_g.the_clique_backend.model.enums.FileEnums;
import com.umesha_g.the_clique_backend.repository.BrandRepository;
import com.umesha_g.the_clique_backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class BrandService {
    private ModelMapper modelMapper;
    private BrandRepository brandRepository;
    private FileStorageService fileStorageService;
    private DiscountService discountService;
    private ProductRepository productRepository;
    private DiscountPriorityService discountPriorityService;

    @Autowired
    public BrandService(ModelMapper modelMapper, BrandRepository brandRepository, FileStorageService fileStorageService, DiscountService discountService, ProductRepository productRepository, DiscountPriorityService discountPriorityService) {
        this.modelMapper = modelMapper;
        this.brandRepository = brandRepository;
        this.fileStorageService = fileStorageService;
        this.discountService = discountService;
        this.productRepository = productRepository;
        this.discountPriorityService = discountPriorityService;
    }

    @Transactional
    public BrandResponse createBrand(BrandRequest brandRequest) throws ResourceNotFoundException {
        if (brandRepository.existsByName(brandRequest.getName())) {
            throw new RuntimeException("Brand with this name already exists");
        }

        Brand brand = modelMapper.map(brandRequest, Brand.class);
        brand.setActive(true);

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
    public BrandResponse updateBrand(String id, BrandRequest request) throws ResourceNotFoundException, FileStorageException {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        brand.setName(request.getName());
        brand.setDescription(request.getDescription());

        if (!brand.getLogoUrl().isEmpty() && request.getLogoFile() !=null){
            System.out.println("file name = "+ brand.getLogoUrl().substring(14));
            fileStorageService.deleteFile(brand.getLogoUrl().substring(14));
        }

        return brandLogoProcess(request, brand);
    }

    @Transactional
    public BrandResponse setBrandState(String id, Boolean state) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        brand.setActive(state);

        Brand savedBrand =  brandRepository.save(brand);
        return modelMapper.map(savedBrand,BrandResponse.class);
    }

    @Transactional
    public void deleteBrand(String id) throws FileStorageException {
        if (!brandRepository.existsById(id)) {
            throw new RuntimeException("Brand not found");
        }
        Brand brand = brandRepository.findById(id).orElse(null);
        assert brand != null;
        if (!brand.getLogoUrl().isEmpty()){
            System.out.println("file name = " +  brand.getLogoUrl().substring(14));
            fileStorageService.deleteFile(Objects.requireNonNull(brand.getLogoUrl().substring(14)));
        }

        brandRepository.deleteById(id);
    }

    private BrandResponse brandLogoProcess(BrandRequest request, Brand brand) throws ResourceNotFoundException {
        if (request.getLogoFile() != null && !request.getLogoFile().isEmpty()) {
            String prefix = "brand_logo_" + brand.getId();
            String fileName;
            try {
                fileName = fileStorageService.storeFile(request.getLogoFile(), prefix, FileEnums.ImageType.BRAND);
                brand.setLogoUrl("/api/v1/files/" + fileName);
            } catch (FileStorageException e) {
                throw new RuntimeException(e);
            }
        } else if (request.getExistingLogoUrl() != null && !request.getExistingLogoUrl().isEmpty()) {
            brand.setLogoUrl(request.getExistingLogoUrl());
        } else {
            brand.setLogoUrl("");
        }

        if (!request.getDiscountId().isEmpty()) {
            Discount discount = discountService.getDiscount(request.getDiscountId());
            brand.setDiscount(discount);
        } else {
            brand.setDiscount(null);
        }

        Brand savedBrand = brandRepository.save(brand);

        List<Product> brandProducts = productRepository.findByBrand(savedBrand);
        for (Product product : brandProducts) {
            discountPriorityService.applyHighestPriorityDiscount(product);
        }

        return modelMapper.map(savedBrand, BrandResponse.class);
    }
}