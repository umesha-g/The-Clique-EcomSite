package com.umesha_g.store_backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.umesha_g.store_backend.model.Product;
import com.umesha_g.store_backend.model.User;
import com.umesha_g.store_backend.repository.ProductRepository;
import com.umesha_g.store_backend.util.CookieUtil;
import com.umesha_g.store_backend.util.IdGen;
import com.umesha_g.store_backend.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Autowired
    private CookieUtil cookieUtil;

    @Autowired
    private IdGen idGen;

    private User getUserFromRequest(HttpServletRequest request) {
        String token = cookieUtil.getTokenFromCookie(request);
        if (token == null) {
            throw new RuntimeException("Authentication token not found");
        }
        String email = jwtUtil.extractEmail(token);
        return userService.findByEmail(email);
    }

    public Product save(Product product) {
        return productRepository.save(product);
    }

    public List<Product> findBySeller(User seller) {
        return productRepository.findBySeller(seller);
    }

    public Product findById(String id) {
        return productRepository.findById(id).orElse(null);
    }

    public void deleteById(String id) {
        productRepository.deleteById(id);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();

    }

    public List<Product> searchProducts(String query) {
        return productRepository.findByNameContainingIgnoreCase(query);
    }

    public List<String> getSearchSuggestions(String query) {
        return productRepository.findTop5ByNameContainingIgnoreCase(query)
                .stream()
                .map(Product::getName)
                .collect(Collectors.toList());
    }

    public Product createProduct(Product product, HttpServletRequest request) {
        User seller = getUserFromRequest(request);

        product.setId(idGen.generateId(12, "Product"));
        product.setSeller(seller);
        product.setCreatedAt(LocalDateTime.now());
        return save(product);
    }

    public List<Product> getSellerProducts(HttpServletRequest request) {
        User seller = getUserFromRequest(request);
        return findBySeller(seller);
    }

    public Product getProductById(String id, HttpServletRequest request) {
        getUserFromRequest(request); // Authenticate user
        return findById(id);
    }

    public Product updateProduct(String id, Product product, HttpServletRequest request) {
        User seller = getUserFromRequest(request);

        Product existingProduct = findById(id);
        if (existingProduct == null || !existingProduct.getSeller().equals(seller)) {
            throw new RuntimeException("Product not found or not owned by the seller");
        }
        product.setId(id);
        product.setSeller(seller);
        product.setCreatedAt(existingProduct.getCreatedAt()); // Preserve the original creation date
        product.setUpdatedAt(LocalDateTime.now()); // Set the update time
        return save(product);
    }

    public void deleteProduct(String id, HttpServletRequest request) {
        User seller = getUserFromRequest(request);

        Product existingProduct = findById(id);
        if (existingProduct == null || !existingProduct.getSeller().equals(seller)) {
            throw new RuntimeException("Product not found or not owned by the seller");
        }
        deleteById(id);
    }
}