package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.dto.request.DiscountRequest;
import com.umesha_g.the_clique_backend.dto.response.DiscountResponse;
import com.umesha_g.the_clique_backend.dto.response.MiniDiscountResponse;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.model.entity.Discount;
import com.umesha_g.the_clique_backend.repository.CategoryRepository;
import com.umesha_g.the_clique_backend.repository.DiscountRepository;
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
public class DiscountService {
    private DiscountRepository discountRepository;
    private CategoryRepository categoryRepository;
    private ProductRepository productRepository;
    private ModelMapper modelMapper;

    @Autowired
    public DiscountService(DiscountRepository discountRepository, CategoryRepository categoryRepository, ProductRepository productRepository, ModelMapper modelMapper) {
        this.discountRepository = discountRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.modelMapper = modelMapper;
    }

    @Transactional
    public DiscountResponse createDiscount(DiscountRequest request) {
        Discount discount = modelMapper.map(request, Discount.class);
        discount.setActive(true);
        Discount savedDiscount = discountRepository.save(discount);
        return modelMapper.map(savedDiscount, DiscountResponse.class);
    }

    public DiscountResponse findDiscount(String id) throws ResourceNotFoundException {
        Discount discount = getDiscount(id);
        return modelMapper.map(discount, DiscountResponse.class);
    }

    public Discount getDiscount(String id) throws ResourceNotFoundException {
        return discountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Discount", "id", id));
    }

    public List<DiscountResponse> getAllDiscounts() {
        return discountRepository.findAll().stream()
                .map(discount -> modelMapper.map(discount, DiscountResponse.class))
                .collect(Collectors.toList());
    }

    public List<MiniDiscountResponse> getActiveDiscounts() {
        return discountRepository.findByIsActiveTrue().stream()
                .map(discount -> modelMapper.map(discount, MiniDiscountResponse.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public DiscountResponse updateDiscount(String id, DiscountRequest request) throws ResourceNotFoundException {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Discount", "id", id));

        modelMapper.map(request, discount);

        Discount updatedDiscount = discountRepository.save(discount);
        return modelMapper.map(updatedDiscount, DiscountResponse.class);
    }

    @Transactional
    public DiscountResponse setDiscountState(String id, Boolean state) throws ResourceNotFoundException {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Discount", "id", id));

        discount.setActive(state);

        Discount updatedDiscount = discountRepository.save(discount);
        return modelMapper.map(updatedDiscount, DiscountResponse.class);
    }

    @Transactional
    public void deleteDiscount(String id) throws ResourceNotFoundException {
        if (!discountRepository.existsById(id)) {
            throw new ResourceNotFoundException("Discount", "id", id);
        }
        discountRepository.deleteById(id);
    }
}