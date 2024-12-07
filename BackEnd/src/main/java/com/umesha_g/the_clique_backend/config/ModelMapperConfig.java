package com.umesha_g.the_clique_backend.config;

import com.umesha_g.the_clique_backend.dto.request.*;
import com.umesha_g.the_clique_backend.dto.response.*;
import com.umesha_g.the_clique_backend.model.entity.*;
import com.umesha_g.the_clique_backend.model.entity.admin.ProductStatistics;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.modelmapper.convention.MatchingStrategies;
import org.modelmapper.spi.MappingContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STRICT)
                .setSkipNullEnabled(true)
                .setFieldMatchingEnabled(true)
                .setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE);

        configureRequestMappings(modelMapper);

        configureResponseMappings(modelMapper);

        return modelMapper;
    }

    private void configureRequestMappings(ModelMapper modelMapper) {
        // User Request mapping
        modelMapper.createTypeMap(UserRequest.class, User.class)
                .addMappings(mapper -> {
                    mapper.map(UserRequest::getEmail, User::setEmail);
                    mapper.map(UserRequest::getFirstName, User::setFirstName);
                    mapper.map(UserRequest::getLastName, User::setLastName);
                    mapper.map(UserRequest::getPhoneNumber, User::setPhoneNumber);
                });

        // Address Request mapping
        modelMapper.createTypeMap(AddressRequest.class, Address.class)
                .addMappings(mapper -> {
                    mapper.map(AddressRequest::getReceiverName, Address::setReceiverName);
                    mapper.map(AddressRequest::getPhoneNumber, Address::setPhoneNumber);
                    mapper.map(AddressRequest::getAddressLine, Address::setAddressLine);
                    mapper.map(AddressRequest::getCity, Address::setCity);
                    mapper.map(AddressRequest::getProvince, Address::setProvince);
                    mapper.map(AddressRequest::getPostalCode, Address::setPostalCode);
                    mapper.map(AddressRequest::getCountry, Address::setCountry);
                    mapper.map(AddressRequest::isDefault, Address::setDefault);
                });

        // Product Request mapping
        modelMapper.createTypeMap(ProductRequest.class, Product.class)
                .addMappings(mapper -> {
                    mapper.map(ProductRequest::getName, Product::setName);
                    mapper.map(ProductRequest::getPrice, Product::setPrice);
                    mapper.map(ProductRequest::getStock, Product::setStock);
                    mapper.map(ProductRequest::getDescription, Product::setDescription);
                    mapper.map(ProductRequest::getGender, Product::setGender);
                    mapper.map(ProductRequest::getSizes, Product::setSizes);
                    mapper.map(ProductRequest::getColors, Product::setColors);
                });

        // Order Request mapping
        modelMapper.createTypeMap(OrderRequest.class, Order.class)
                .addMappings(mapper -> {
                    mapper.skip(Order::setId);
                    mapper.skip(Order::setCreatedAt);
                    mapper.skip(Order::setUpdatedAt);
                });

        // Brand Request mapping
        modelMapper.createTypeMap(BrandRequest.class, Brand.class)
                .addMappings(mapper -> {
                    mapper.map(BrandRequest::getName, Brand::setName);
                    mapper.map(BrandRequest::getDescription, Brand::setDescription);
                });

        // Discount Request mapping
        modelMapper.createTypeMap(DiscountRequest.class, Discount.class)
                .addMappings(mapper -> {
                    mapper.map(DiscountRequest::getName, Discount::setName);
                    mapper.map(DiscountRequest::getDescription, Discount::setDescription);
                    mapper.map(DiscountRequest::getDiscountPercentage, Discount::setDiscountPercentage);
                });

        // Category Request mapping
        modelMapper.createTypeMap(CategoryRequest.class, Category.class)
                .addMappings(mapper -> {
                    mapper.map(CategoryRequest::getName, Category::setName);
                    mapper.map(CategoryRequest::getDescription, Category::setDescription);
                });
    }

    private void configureResponseMappings(ModelMapper modelMapper) {
        // Address mapping
        modelMapper.createTypeMap(Address.class, AddressResponse.class)
                .addMappings(mapper -> {
                    mapper.map(Address::getId, AddressResponse::setId);
                    mapper.map(Address::getReceiverName, AddressResponse::setReceiverName);
                    mapper.map(Address::getPhoneNumber, AddressResponse::setPhoneNumber);
                    mapper.map(Address::getAddressLine, AddressResponse::setAddressLine);
                    mapper.map(Address::getCity, AddressResponse::setCity);
                    mapper.map(Address::getProvince, AddressResponse::setProvince);
                    mapper.map(Address::getCountry, AddressResponse::setCountry);
                    mapper.map(Address::getPostalCode, AddressResponse::setPostalCode);
                    mapper.map(Address::isDefault, AddressResponse::setDefault);
                    mapper.map(Address::getAddressType, AddressResponse::setAddressType);
                });

        // Converter for handling address -> address response
        Converter<Address, AddressResponse> addressToAddressResponseConverter = ctx ->
                ctx.getSource() == null ? null : modelMapper.map(ctx.getSource(), AddressResponse.class);

        // Review mapping
        modelMapper.createTypeMap(Review.class, ReviewResponse.class)
                .addMappings(mapper -> {
                    mapper.map(src -> src.getUser().getFirstName(), ReviewResponse::setUserFirstName);
                    mapper.map(Review::getRating, ReviewResponse::setRating);
                    mapper.map(Review::getComment, ReviewResponse::setComment);
                    mapper.map(Review::getImageUrls, ReviewResponse::setImageUrls);
                    mapper.map(Review::getCreatedAt, ReviewResponse::setCreatedAt);
                });

        // User mapping
        modelMapper.createTypeMap(User.class, UserResponse.class)
                .addMappings(mapper -> {
                    mapper.map(User::getId, UserResponse::setId);
                    mapper.map(User::getEmail, UserResponse::setEmail);
                    mapper.map(User::getFirstName, UserResponse::setFirstName);
                    mapper.map(User::getLastName, UserResponse::setLastName);
                    mapper.map(User::getPhoneNumber, UserResponse::setPhoneNumber);
                    mapper.map(User::getRole, UserResponse::setRole);
                    mapper.map(User::getCreatedAt, UserResponse::setCreatedAt);
                });

        // Converter for handling product -> product card response
        Converter<Product, ProductCardResponse> productToProductCardResponseConverter = ctx ->
                ctx.getSource() == null ? null : modelMapper.map(ctx.getSource(), ProductCardResponse.class);

        Converter<List<Product>, List<ProductCardResponse>> productListToCardResponseConverter = ctx -> {
            if (ctx.getSource() == null) {
                return Collections.emptyList();
            }
            return ctx.getSource().stream()
                    .map(product -> modelMapper.map(product, ProductCardResponse.class))
                    .collect(Collectors.toList());
        };

        //Wishlist mapping
        modelMapper.addMappings(new PropertyMap<Wishlist, WishlistResponse>() {
            @Override
            protected void configure() {
                map().setId(source.getId());
                using(productListToCardResponseConverter).map(source.getProducts(), destination.getProducts());
            }
        });

        // Order Item mapping
        modelMapper.addMappings(new PropertyMap<OrderItem, OrderItemResponse>() {
            @Override
            protected void configure() {
                map().setId(source.getId());
                map().setSubTotal(source.getSubTotal());
                map().setQuantity(source.getQuantity());
                map().setSelectedColour(source.getSelectedColour());
                map().setSelectedSize(source.getSelectedSize());
                using(productToProductCardResponseConverter).map(source.getProduct(), destination.getProduct());
            }
        });

        // Converter for handling order item -> order item response
        Converter<List<OrderItem>, List<OrderItemResponse>> orderItemToOrderItemResponseConverter = ctx -> {
            if (ctx.getSource() == null) {
                return Collections.emptyList();
            }
            return ctx.getSource().stream()
                    .map(item -> modelMapper.map(item, OrderItemResponse.class))
                    .collect(Collectors.toList());
        };

        // Order mapping
        modelMapper.addMappings(new PropertyMap<Order, OrderResponse>() {
            @Override
            protected void configure() {
                map().setId(source.getId());
                map().setSubTotal(source.getSubTotal());
                map().setTotalAmount(source.getTotalAmount());
                map().setShippingCost(source.getShippingCost());
                map().setStatus(source.getStatus());
                map().setPaymentMethod(source.getPaymentMethod());
                map().setEstimatedDeliveryDate(source.getEstimatedDeliveryDate());
                map().setCreatedAt(source.getCreatedAt());
                map().setUpdatedAt(source.getUpdatedAt());
                using(addressToAddressResponseConverter).map(source.getShippingAddress(), destination.getShippingAddress());
                using(orderItemToOrderItemResponseConverter).map(source.getOrderItems(), destination.getOrderItems());
            }
        });

        //Cart Item mapping
        modelMapper.addMappings(new PropertyMap<CartItem, CartItemResponse>() {
            @Override
            protected void configure() {
                map().setId(source.getId());
                map().setSubTotal(source.getSubTotal());
                map().setQuantity(source.getQuantity());
                map().setSelectedColour(source.getSelectedColour());
                map().setSelectedSize(source.getSelectedSize());
                using(productToProductCardResponseConverter).map(source.getProduct(), destination.getProduct());
            }
        });

        // Converter for handling cart item -> cart item response
        Converter<List<CartItem>, List<CartItemResponse>> cartItemToCartItemResponseConverter = ctx -> {
            if (ctx.getSource() == null) {
                return Collections.emptyList();
            }
            return ctx.getSource().stream()
                    .map(item -> modelMapper.map(item, CartItemResponse.class))
                    .collect(Collectors.toList());
        };

        // Cart mapping
        modelMapper.addMappings(new PropertyMap<Cart, CartResponse>() {
            @Override
            protected void configure() {
                // Mapping simple fields
                map().setId(source.getId());
                map().setTotalAmount(source.getTotalAmount());
                map().setCreatedAt(source.getCreatedAt());
                using(cartItemToCartItemResponseConverter).map(source.getCartItems(), destination.getCartItems());
            }
        });


        // Discount mapping
        modelMapper.createTypeMap(Discount.class, DiscountResponse.class)
                .addMappings(mapper -> {
                    mapper.map(Discount::getId, DiscountResponse::setId);
                    mapper.map(Discount::getName, DiscountResponse::setName);
                    mapper.map(Discount::getDiscountPercentage, DiscountResponse::setDiscountPercentage);
                    mapper.map(Discount::getStartDate, DiscountResponse::setStartDate);
                    mapper.map(Discount::getEndDate, DiscountResponse::setEndDate);
                    mapper.map(Discount::getDescription, DiscountResponse::setDescription);
                });

        modelMapper.createTypeMap(Discount.class, MiniDiscountResponse.class)
                .addMappings(mapper -> {
                    mapper.map(Discount::getId, MiniDiscountResponse::setId);
                    mapper.map(Discount::getName, MiniDiscountResponse::setName);
                    mapper.map(Discount::getDiscountPercentage, MiniDiscountResponse::setDiscountPercentage);
                    mapper.map(Discount::isActive, MiniDiscountResponse::setActive);
                });

        // Converter for handling order discount -> mini discount response
        Converter<Discount, MiniDiscountResponse> discountToMiniDiscountResponseConverter = ctx ->
                ctx.getSource() == null ? null : modelMapper.map(ctx.getSource(), MiniDiscountResponse.class);

        //Brand mapping
        modelMapper.addMappings(new PropertyMap<Brand, BrandResponse>() {
            @Override
            protected void configure() {
                map().setId(source.getId());
                map().setName(source.getName());
                map().setDescription(source.getDescription());
                map().setLogoUrl(source.getLogoUrl());
                map().setActive(source.isActive());
                using(discountToMiniDiscountResponseConverter).map(source.getDiscount(), destination.getDiscount());
            }
        });

        modelMapper.createTypeMap(Brand.class, MiniBrandResponse.class)
                .addMappings(mapper -> {
                    mapper.map(Brand::getId, MiniBrandResponse::setId);
                    mapper.map(Brand::getName, MiniBrandResponse::setName);
                });

        // Converter for handling order brand -> mini brand response
        Converter<Brand, MiniBrandResponse> brandToMiniBrandResponseConverter = ctx ->
                ctx.getSource() == null ? null : modelMapper.map(ctx.getSource(), MiniBrandResponse.class);

        //Category mapping
        modelMapper.addMappings(new PropertyMap<Category, CategoryResponse>() {
            @Override
            protected void configure() {
                map().setId(source.getId());
                map().setName(source.getName());
                map().setDescription(source.getDescription());
                using(discountToMiniDiscountResponseConverter).map(source.getDiscount(), destination.getDiscount());
            }
        });

        modelMapper.createTypeMap(Category.class, MiniCategoryResponse.class)
                .addMappings(mapper -> {
                    mapper.map(Category::getId, MiniCategoryResponse::setId);
                    mapper.map(Category::getName, MiniCategoryResponse::setName);
                });

        // Converter for handling order category -> mini category response
        Converter<Category, MiniCategoryResponse> categoryToMiniCategoryResponseConverter = ctx ->
                ctx.getSource() == null ? null : modelMapper.map(ctx.getSource(), MiniCategoryResponse.class);

        //File Reference mapping
        modelMapper.createTypeMap(FileReference.class, FileRefResponse.class)
                .addMappings(mapper -> {
                    mapper.map(FileReference::getId, FileRefResponse::setId);
                    mapper.map(FileReference::getStandardUrl, FileRefResponse::setStandardUrl);
                    mapper.map(FileReference::isCardImage, FileRefResponse::setCardImage);
                    mapper.map(FileReference::getDisplayOrder, FileRefResponse::setDisplayOrder);
                    mapper.map(FileReference::getStatus, FileRefResponse::setStatus);

                });

        // Product mappings
        modelMapper.addMappings(new PropertyMap<Product, ProductResponse>() {
            @Override
            protected void configure() {
                map().setId(source.getId());
                map().setName(source.getName());
                map().setPrice(source.getPrice());
                map().setStock(source.getStock());
                map().setRating(source.getRating());
                map().setReviewCount(source.getReviewCount());
                map().setDescription(source.getDescription());
                using(brandToMiniBrandResponseConverter).map(source.getBrand(), destination.getBrand());
                using(categoryToMiniCategoryResponseConverter).map(source.getCategory(), destination.getCategory());
                map().setDetailImageUrls(source.getDetailImageUrls());
                map().setCardImageUrl(source.getCardImageUrl());
                map().setGender(source.getGender());
                map().setSizes(source.getSizes());
                map().setColors(source.getColors());
                map().setViewCount(source.getViewCount());
                map().setPurchaseCount(source.getPurchaseCount());
                map().setCreatedAt(source.getCreatedAt());
                map().setUpdatedAt(source.getUpdatedAt());
                using(discountToMiniDiscountResponseConverter).map(source.getDirectDiscount(), destination.getDirectDiscount());
                using(discountToMiniDiscountResponseConverter).map(source.getOtherDiscount(), destination.getOtherDiscount());
            }
        });

        // Converter for handling order product -> product response
//        Converter<Product, ProductResponse> productToProductResponseConverter = ctx ->
//                ctx.getSource() == null ? null : modelMapper.map(ctx.getSource(), ProductResponse.class);

        modelMapper.addMappings(new PropertyMap<Product, ProductCardResponse>() {
            @Override
            protected void configure() {
                map().setId(source.getId());
                map().setName(source.getName());
                map().setPrice(source.getPrice());
                map().setRating(source.getRating());
                map().setReviewCount(source.getReviewCount());
                map().setCardImageUrl(source.getCardImageUrl());
                map().setPurchaseCount(source.getPurchaseCount());
                map().setStock(source.getStock());
                using(discountToMiniDiscountResponseConverter).map(source.getDirectDiscount(), destination.getDirectDiscount());
                using(discountToMiniDiscountResponseConverter).map(source.getOtherDiscount(), destination.getOtherDiscount());
            }
        });

        Converter<Map<LocalDate, Integer>, Map<LocalDate, Integer>> mapDeepCopyConverter =
                new Converter<Map<LocalDate, Integer>, Map<LocalDate, Integer>>() {
                    @Override
                    public Map<LocalDate, Integer> convert(MappingContext<Map<LocalDate, Integer>, Map<LocalDate, Integer>> context) {
                        Map<LocalDate, Integer> sourceMap = context.getSource();
                        if (sourceMap == null) {
                            return null;
                        }

                        // Create a new HashMap with the same entries
                        Map<LocalDate, Integer> destinationMap = new HashMap<>();
                        for (Map.Entry<LocalDate, Integer> entry : sourceMap.entrySet()) {
                            destinationMap.put(entry.getKey(), entry.getValue());
                        }

                        return destinationMap;
                    }
                };


        modelMapper.createTypeMap(ProductStatistics.class, ProductStatisticsResponse.class)
                .addMappings(mapper -> {
                    mapper.map(ProductStatistics::getId, ProductStatisticsResponse::setId);
                    mapper.map(src -> src.getProduct().getId(), ProductStatisticsResponse::setProductId);
                    mapper.map(ProductStatistics::getDate, ProductStatisticsResponse::setDate);
                    mapper.map(ProductStatistics::getViewCount, ProductStatisticsResponse::setViewCount);
                    mapper.map(ProductStatistics::getPurchaseCount, ProductStatisticsResponse::setPurchaseCount);
                    mapper.map(ProductStatistics::getRevenue, ProductStatisticsResponse::setRevenue);
                    mapper.map(ProductStatistics::getAverageRating, ProductStatisticsResponse::setAverageRating);
                    mapper.map(ProductStatistics::getReviewCount, ProductStatisticsResponse::setReviewCount);
                    mapper.map(ProductStatistics::getCreatedAt, ProductStatisticsResponse::setCreatedAt);
                    mapper.map(ProductStatistics::getUpdatedAt, ProductStatisticsResponse::setUpdatedAt);

//                    // Use custom converter for view history
//                    mapper.using(mapDeepCopyConverter)
//                            .map(ProductStatistics::getViewHistory, ProductStatisticsResponse::setViewHistory);
//
//                    // Use custom converter for purchase history
//                    mapper.using(mapDeepCopyConverter)
//                            .map(ProductStatistics::getPurchaseHistory, ProductStatisticsResponse::setPurchaseHistory);
                });
    }
}