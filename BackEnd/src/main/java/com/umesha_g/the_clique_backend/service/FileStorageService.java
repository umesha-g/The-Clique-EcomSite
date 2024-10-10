package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.config.FileStorageConfig;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileStorageService {
    private final FileStorageConfig storageConfig;
    private final Path fileStorageLocation;

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(fileStorageLocation);
        } catch (IOException ex) {
            throw new FileStorageException("Could not create upload directory", ex);
        }
    }

    public String storeFile(MultipartFile file, String prefix) {
        validateFile(file);

        String fileName = generateFileName(file, prefix);
        try {
            Path targetLocation = fileStorageLocation.resolve(fileName);

            // Create different sizes of the image
            BufferedImage originalImage = ImageIO.read(file.getInputStream());

            // Store thumbnail
            String thumbnailName = "thumb_" + fileName;
            Path thumbnailLocation = fileStorageLocation.resolve(thumbnailName);
            saveResizedImage(originalImage, thumbnailLocation,
                    storageConfig.getThumbnailSize());

            // Store standard size
            saveResizedImage(originalImage, targetLocation,
                    storageConfig.getStandardSize());

            return fileName;
        } catch (IOException ex) {
            throw new FileStorageException("Could not store file " + fileName, ex);
        }
    }

    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return resource;
            } else {
                throw new FileNotFoundException("File not found: " + fileName);
            }
        } catch (Exception ex) {
            throw new FileStorageException("File not found " + fileName, ex);
        }
    }

    public void deleteFile(String fileName) {
        try {
            Path filePath = fileStorageLocation.resolve(fileName);
            Files.deleteIfExists(filePath);

            // Delete thumbnail if exists
            String thumbnailName = "thumb_" + fileName;
            Path thumbnailPath = fileStorageLocation.resolve(thumbnailName);
            Files.deleteIfExists(thumbnailPath);
        } catch (IOException ex) {
            throw new FileStorageException("Could not delete file " + fileName, ex);
        }
    }

    private void validateFile(MultipartFile file) {
        // Check file size
        if (file.getSize() > storageConfig.getMaxFileSize()) {
            throw new FileStorageException("File size exceeds maximum limit");
        }

        // Check file type
        String contentType = file.getContentType();
        if (!storageConfig.getAllowedFileTypes().contains(contentType)) {
            throw new FileStorageException("Invalid file type");
        }
    }

    private void saveResizedImage(
            BufferedImage original,
            Path targetLocation,
            FileStorageConfig.ImageSize size) throws IOException {

        BufferedImage resized = Thumbnails.of(original)
                .size(size.getWidth(), size.getHeight())
                .outputQuality(storageConfig.getImageQuality() / 100.0)
                .asBufferedImage();

        ImageIO.write(resized, "JPEG", targetLocation.toFile());
    }

    private String generateFileName(MultipartFile file, String prefix) {
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = getFileExtension(originalFileName);
        String timestamp = LocalDateTime.now().format(
                DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));

        return String.format("%s_%s_%s%s",
                prefix,
                timestamp,
                UUID.randomUUID().toString().substring(0, 8),
                fileExtension);
    }

    private String getFileExtension(String fileName) {
        return fileName.substring(fileName.lastIndexOf("."));
    }
}