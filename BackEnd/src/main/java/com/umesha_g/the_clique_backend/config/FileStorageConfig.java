package com.umesha_g.the_clique_backend.config;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "file.storage")
@Data
public class FileStorageConfig {
    private String productDir;
    private String logoDir;
    private String reviewDir;
    private String userDpDir;
    private long maxFileSize = 5242880; // 5MB
    private List<String> allowedFileTypes = Arrays.asList("image/jpeg", "image/png", "image/webp", "image/jpg");
    private int imageQuality = 90; // JPEG compression quality
    private ImageSize thumbnailSize = new ImageSize(300, 300);
    private ImageSize standardSize = new ImageSize(1000, 1000);

    @Data
    @AllArgsConstructor
    public static class ImageSize {
        private int width;
        private int height;
    }

    @Bean
    public Path productStorageLocation() {
        return Paths.get(productDir).toAbsolutePath().normalize();
    }

    @Bean
    public Path logoStorageLocation() {
        return Paths.get(logoDir).toAbsolutePath().normalize();
    }

    @Bean
    public Path reviewStorageLocation() {
        return Paths.get(reviewDir).toAbsolutePath().normalize();
    }

    @Bean
    public Path userDPStorageLocation() {
        return Paths.get(userDpDir).toAbsolutePath().normalize();
    }
}