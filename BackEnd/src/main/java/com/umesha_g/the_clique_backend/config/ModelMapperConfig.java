package com.umesha_g.the_clique_backend.config;

import com.umesha_g.the_clique_backend.dto.response.*;
import com.umesha_g.the_clique_backend.model.entity.*;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();

        // Set strict matching strategy to avoid unwanted mappings
        modelMapper.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STRICT)
                .setSkipNullEnabled(false);

        // Product mapping
        modelMapper.createTypeMap(Product.class, ProductResponse.class)
                .addMappings(mapper -> {
                    mapper.map(src -> src.getCategory().getName(), ProductResponse::setCategoryName);
                    mapper.map(src -> src.getBrand().getName(), ProductResponse::setBrandName);
                    mapper.map(Product::getDiscount, ProductResponse::setActiveDiscount);
                    mapper.map(Product::getImageUrls, ProductResponse::setImageUrls);
                    mapper.map(Product::getSizes, ProductResponse::setSizes);
                    mapper.map(Product::getColors, ProductResponse::setColors);
                });

        // Cart mapping
        modelMapper.createTypeMap(Cart.class, CartResponse.class)
                .addMappings(mapper -> {
                    mapper.map(Cart::getTotalAmount, CartResponse::setTotalAmount);
                })
                .setPreConverter(context -> {
                    Cart cart = context.getSource();
                    CartResponse cartResponse = context.getDestination();

                    if (cart.getCartItems() != null) {
                        Map<ProductResponse, Integer> itemsMap = new HashMap<>();
                        cart.getCartItems().forEach(item -> {
                            if (item.getProduct() != null) {
                                ProductResponse productResponse = modelMapper.map(item.getProduct(), ProductResponse.class);
                                itemsMap.put(productResponse, item.getQuantity());
                            }
                        });
                        cartResponse.setItems(itemsMap);
                    }

                    return cartResponse;
                });

        // User mapping
        modelMapper.createTypeMap(User.class, UserResponse.class)
                .addMappings(mapper -> {
                    mapper.map(User::getFirstName, UserResponse::setFirstName);
                    mapper.map(User::getLastName, UserResponse::setLastName);
                    mapper.map(User::getPhoneNumber, UserResponse::setPhoneNumber);
                });

        // OrderItem mapping
        modelMapper.createTypeMap(OrderItem.class, OrderItemResponse.class)
                .addMappings(mapper -> {
                    mapper.map(OrderItem::getProduct, OrderItemResponse::setProduct);
                });

        // Review mapping
        modelMapper.createTypeMap(Review.class, ReviewResponse.class)
                .addMappings(mapper -> {
                    mapper.map(Review::getImageUrls, ReviewResponse::setImageUrls);
                });

        // Existing mappings
        modelMapper.createTypeMap(Notification.class, NotificationResponse.class);
        modelMapper.createTypeMap(Address.class, AddressResponse.class);
        modelMapper.createTypeMap(Discount.class, DiscountResponse.class);

        return modelMapper;
    }
}