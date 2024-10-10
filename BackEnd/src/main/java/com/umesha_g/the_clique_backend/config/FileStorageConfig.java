package com.umesha_g.the_clique_backend.config;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "file.storage")
@Data
public class FileStorageConfig {
    private String uploadDir;
    private long maxFileSize = 5242880; // 5MB
    private List<String> allowedFileTypes = Arrays.asList("image/jpeg", "image/png", "image/webp");
    private int imageQuality = 85; // JPEG compression quality
    private ImageSize thumbnailSize = new ImageSize(200, 200);
    private ImageSize standardSize = new ImageSize(800, 800);

    @Data
    @AllArgsConstructor
    public static class ImageSize {
        private int width;
        private int height;
    }
}