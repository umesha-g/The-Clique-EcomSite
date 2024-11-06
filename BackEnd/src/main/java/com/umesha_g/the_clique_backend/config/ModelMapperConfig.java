package com.umesha_g.the_clique_backend.config;

import com.umesha_g.the_clique_backend.dto.request.*;
import com.umesha_g.the_clique_backend.dto.response.*;
import com.umesha_g.the_clique_backend.model.entity.*;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.*;

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

        // Request DTO mappings
        configureRequestMappings(modelMapper);

        // Response DTO mappings
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
                    mapper.map(BrandRequest::isActive, Brand::setActive);
                });

        // Discount Request mapping
        modelMapper.createTypeMap(DiscountRequest.class, Discount.class)
                .addMappings(mapper -> {
                    mapper.map(DiscountRequest::getName, Discount::setName);
                    mapper.map(DiscountRequest::getDescription, Discount::setDescription);
                    mapper.map(DiscountRequest::isActive, Discount::setActive);
                    mapper.map(DiscountRequest::getDiscountPercentage, Discount::setDiscountPercentage);
                    //mapper.map(DiscountRequest::getApplicableCategoryIds, Discount::setApplicableCategories);
                    mapper.map(DiscountRequest::getStartDate, Discount::setStartDate);
                    mapper.map(DiscountRequest::getEndDate, Discount::setEndDate);
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

        // Converter for handling the shipping address
        Converter<Address, AddressResponse> addressToResponseConverter = ctx ->
                ctx.getSource() == null ? null : modelMapper.map(ctx.getSource(), AddressResponse.class);

        // Product mapping
        modelMapper.createTypeMap(Product .class, ProductResponse.class)
                .addMappings(mapper -> {
                    mapper.map(Product::getId, ProductResponse::setId);
                    mapper.map(Product::getName, ProductResponse::setName);
                    mapper.map(Product::getPrice, ProductResponse::setPrice);
                    mapper.map(Product::getStock, ProductResponse::setStock);
                    mapper.map(Product::getRating, ProductResponse::setRating);
                    mapper.map(Product::getDescription, ProductResponse::setDescription);
                    mapper.map(src -> src.getBrand().getName(), ProductResponse::setBrandName);
                    mapper.map(src -> src.getCategory().getName(), ProductResponse::setCategoryName);
                    mapper.map(Product::getDetailImageUrls, ProductResponse::setDetailImageUrls);
                    mapper.map(Product::getCardImageUrl, ProductResponse::setCardImageUrl);
                    mapper.map(Product::getGender, ProductResponse::setGender);
                    mapper.map(Product::getSizes, ProductResponse::setSizes);
                    mapper.map(Product::getColors, ProductResponse::setColors);
                    //mapper.map(Product::getViewCount, ProductResponse::setViewCount);
                    mapper.map(Product::getPurchaseCount, ProductResponse::setPurchaseCount);
                    mapper.map(Product::getDiscount, ProductResponse::setActiveDiscount);
                });

        Converter<Product, ProductResponse> producttoProductResponseConverter = ctx ->
                ctx.getSource() == null ? null : modelMapper.map(ctx.getSource(), ProductResponse.class);

        modelMapper.createTypeMap(Product .class, ProductCardResponse.class)
                .addMappings(mapper -> {
                    mapper.map(Product::getId, ProductCardResponse::setId);
                    mapper.map(Product::getName, ProductCardResponse::setName);
                    mapper.map(Product::getPrice, ProductCardResponse::setPrice);
                    mapper.map(Product::getStock, ProductCardResponse::setStock);
                    mapper.map(Product::getRating, ProductCardResponse::setRating);
                    mapper.map(Product::getCardImageUrl, ProductCardResponse::setCardImageUrl);
                    mapper.map(Product::getPurchaseCount, ProductCardResponse::setPurchaseCount);
                    mapper.map(Product::getDiscount, ProductCardResponse::setActiveDiscount);
                });

        Converter<Product, ProductCardResponse> producttoProductCardResponseConverter = ctx ->
                ctx.getSource() == null ? null : modelMapper.map(ctx.getSource(), ProductCardResponse.class);

        // Order mapping
        modelMapper.addMappings(new PropertyMap<Order, OrderResponse>() {
            @Override
            protected void configure() {
                map().setId(source.getId());
                map().setTotalAmount(source.getTotalAmount());
                map().setShippingCost(source.getShippingCost());
                map().setStatus(source.getStatus());
                map().setTrackingNumber(source.getTrackingNumber());
                map().setCreatedAt(source.getCreatedAt());
                map().setUpdatedAt(source.getUpdatedAt());
                using(addressToResponseConverter).map(source.getShippingAddress()).setShippingAddress(null);

                using(context -> {
                    List<OrderItem> orderItems = (List<OrderItem>) context.getSource();
                    Map<ProductCardResponse, Integer> itemsMap = new HashMap<>();
                    for (OrderItem orderItem : orderItems) {
                        ProductCardResponse productCardResponse = modelMapper.map(orderItem.getProduct(), ProductCardResponse.class);
                        itemsMap.put(productCardResponse, orderItem.getQuantity());
                    }
                    return itemsMap;
                }).map(source.getOrderItems(), destination.getOrderItems());
            }
        });

        // OrderItem mapping
        modelMapper.addMappings(new PropertyMap<OrderItem, OrderItemResponse>() {
                @Override
                protected void configure() {
                    map().setId(source.getId());
                    map().setQuantity(source.getQuantity());
                    map().setSubTotal(source.getSubTotal());
                    using(producttoProductCardResponseConverter).map(source.getProduct()).setProduct(null);
                }
            });


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
                    mapper.map(User::getCreatedAt,UserResponse::setCreatedAt);
                });

        //Wishlist mapping
        modelMapper.addMappings(new PropertyMap<Wishlist, WishlistResponse>() {
            @Override
            protected void configure() {
                map().setId(source.getId());
                map().setCreatedAt(source.getCreatedAt());

                using(context -> {
                    Set<Product> products = (Set<Product>) context.getSource();
                    Set<ProductCardResponse> productCardSet = new HashSet<>();
                    for (Product product : products) {
                        ProductCardResponse productCardResponse = modelMapper.map(product, ProductCardResponse.class);
                        productCardSet.add(productCardResponse);
                    }
                    return productCardSet;
                }).map(source.getProducts(), destination.getProducts());
            }
        });

        // Cart mapping
        modelMapper.addMappings(new PropertyMap<Cart, CartResponse>() {
            @Override
            protected void configure() {
                // Mapping simple fields
                map().setId(source.getId());
                map().setTotalAmount(source.getTotalAmount());
                map().setCreatedAt(source.getCreatedAt());

                using(context -> {
                    List<CartItem> cartItems = (List<CartItem>) context.getSource();
                    Map<ProductResponse, Integer> itemsMap = new HashMap<>();
                    for (CartItem cartItem : cartItems) {
                        ProductResponse productResponse = modelMapper.map(cartItem.getProduct(), ProductResponse.class);
                        itemsMap.put(productResponse, cartItem.getQuantity());
                    }
                    return itemsMap;
                }).map(source.getCartItems(), destination.getCartItems());
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
                    mapper.map(Discount::getDescription, MiniDiscountResponse::setDescription);
                });

        Converter<Discount, MiniDiscountResponse> discountToMiniDiscountResponseConverter = ctx ->
                ctx.getSource() == null ? null : modelMapper.map(ctx.getSource(), MiniDiscountResponse.class);

//        //Brand mapping
//        modelMapper.createTypeMap(Brand.class,BrandResponse.class)
//                .addMappings(mapper -> {
//                    mapper.map(Brand::getId,BrandResponse::setId);
//                    mapper.map(Brand::getName,BrandResponse::setName);
//                    mapper.map(Brand::getDescription,BrandResponse::setDescription);
//                    mapper.map(Brand::getDiscount,BrandResponse::setDiscount);
//                    mapper.map(Brand::getLogoUrl,BrandResponse::setLogoUrl);
//                    mapper.map(Brand::isActive,BrandResponse::setActive);
//                });

        modelMapper.addMappings(new PropertyMap<Brand, BrandResponse>() {
            @Override
            protected void configure() {
                map().setId(source.getId());
                map().setName(source.getName());
                map().setDescription(source.getDescription());
                map().setLogoUrl(source.getLogoUrl());
                map().setActive(source.isActive());
                using(discountToMiniDiscountResponseConverter).map(source.getDiscount()).setDiscount(null);
            }
        });

        //Category mapping
//        modelMapper.createTypeMap(Category.class, CategoryResponse.class)
//                .addMappings(mapper -> {
//                    mapper.map(Category::getId,CategoryResponse::setId);
//                    mapper.map(Category::getName,CategoryResponse::setName);
//                    mapper.map(Category::getDescription,CategoryResponse::setDescription);
//                    mapper.map(Category::getDiscount,CategoryResponse::setDiscount);
//                });

        modelMapper.addMappings(new PropertyMap<Category, CategoryResponse>() {
            @Override
            protected void configure() {
                map().setId(source.getId());
                map().setName(source.getName());
                map().setDescription(source.getDescription());
                using(discountToMiniDiscountResponseConverter).map(source.getDiscount()).setDiscount(null);
            }
        });

        //File Reference mapping
        modelMapper.createTypeMap(FileReference.class,FileRefResponse.class)
                .addMappings(mapper -> {
                    mapper.map(FileReference::getThumbnailUrl,FileRefResponse::setThumbnailUrl);
                    mapper.map(FileReference::getStandardUrl,FileRefResponse::setStandardUrl);
                    mapper.map(FileReference::isCardImage,FileRefResponse::setCardImage);
                    mapper.map(FileReference::getDisplayOrder,FileRefResponse::setDisplayOrder);
                    mapper.map(FileReference::getStatus,FileRefResponse::setStatus);

        });
    }
}