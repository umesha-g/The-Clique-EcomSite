package com.umesha_g.the_clique_backend.config;

import com.umesha_g.the_clique_backend.model.entity.Cart;
import com.umesha_g.the_clique_backend.model.entity.Notification;
import com.umesha_g.the_clique_backend.model.entity.Product;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();

        // Configure cart mapping strategy
        modelMapper.createTypeMap(Cart.class, CartResponse.class)
                .addMappings(mapper -> {
                    mapper.map(Cart::getItems, CartResponse::setItems);
                    mapper.map(Cart::getTotalAmount, CartResponse::setTotalAmount);
                });

        // Configure product mapping strategy
        modelMapper.createTypeMap(Product.class, ProductResponse.class)
                .addMappings(mapper -> {
                    mapper.map(src -> src.getCategory().getName(), ProductResponse::setCategoryName);
                    mapper.map(src -> src.getBrand().getName(), ProductResponse::setBrandName);
                });

        // Configure notification mapping strategy
        modelMapper.createTypeMap(Notification.class, NotificationResponse.class)
                .addMappings(mapper -> {
                    mapper.map(Notification::getCreatedAt, NotificationResponse::setTimestamp);
                });

        return modelMapper;
    }
}