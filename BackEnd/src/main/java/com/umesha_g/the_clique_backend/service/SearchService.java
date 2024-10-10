package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.dto.ProductSearchDTO;
import com.umesha_g.the_clique_backend.dto.response.ProductResponse;
import com.umesha_g.the_clique_backend.model.entity.Product;
import com.umesha_g.the_clique_backend.repository.ProductRepository;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

public class SearchService {

    private  ProductRepository productRepository;
    private  ModelMapper modelMapper;


    public Page<ProductResponse> searchProducts(ProductSearchDTO searchDTO) {
        Specification<Product> spec = Specification.where(null);

        if (searchDTO.getQuery() != null && !searchDTO.getQuery().isEmpty()) {
            spec = spec.and((root, query, cb) ->
                    cb.or(
                            cb.like(cb.lower(root.get("name")), "%" + searchDTO.getQuery().toLowerCase() + "%"),
                            cb.like(cb.lower(root.get("description")), "%" + searchDTO.getQuery().toLowerCase() + "%")
                    )
            );
        }

        // Add price range filter
        if (searchDTO.getMinPrice() != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("price"), searchDTO.getMinPrice()));
        }
        if (searchDTO.getMaxPrice() != null) {
            spec = spec.and((root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("price"), searchDTO.getMaxPrice()));
        }

        // Add category filter
        if (searchDTO.getCategory() != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("category").get("name"), searchDTO.getCategory()));
        }

        // Add brand filter
        if (searchDTO.getBrand() != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("brand").get("name"), searchDTO.getBrand()));
        }

        // Add gender filter
        if (searchDTO.getGender() != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("gender"), searchDTO.getGender()));
        }

        // Add discount filter
        if (Boolean.TRUE.equals(searchDTO.getOnlyDiscounted())) {
            spec = spec.and((root, query, cb) ->
                    cb.isNotNull(root.get("discount")));
        }

        // Create pageable with sorting
        Sort sort = Sort.by(Sort.Direction.fromString(searchDTO.getSortOrder()), searchDTO.getSortBy());
        PageRequest pageable = PageRequest.of(searchDTO.getPage(), searchDTO.getSize(), sort);

        Page<Product> products = productRepository.findAll(spec, pageable);
        return products.map(product -> modelMapper.map(product, ProductResponse.class);
    }

}