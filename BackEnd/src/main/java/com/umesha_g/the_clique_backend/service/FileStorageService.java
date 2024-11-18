package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.config.FileStorageConfig;
import com.umesha_g.the_clique_backend.exception.FileStorageException;
import com.umesha_g.the_clique_backend.model.enums.FileEnums;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileStorageService {

    private  FileStorageConfig storageConfig;
    private  Path productStorageLocation;
    private  Path logoStorageLocation;
    private  Path reviewStorageLocation;
    private Path userDPStorageLocation;

    @Autowired
    public FileStorageService(FileStorageConfig storageConfig, Path productStorageLocation, Path logoStorageLocation, Path reviewStorageLocation, Path userDPStorageLocation) {
        this.storageConfig = storageConfig;
        this.productStorageLocation = productStorageLocation;
        this.logoStorageLocation = logoStorageLocation;
        this.reviewStorageLocation = reviewStorageLocation;
        this.userDPStorageLocation = userDPStorageLocation;
    }

    @PostConstruct
    public void init() throws FileStorageException {
        try {
            Files.createDirectories(productStorageLocation);
            Files.createDirectories(logoStorageLocation);
            Files.createDirectories(reviewStorageLocation);
            Files.createDirectories(userDPStorageLocation);
        } catch (IOException ex) {
            throw new FileStorageException("Could not create upload directory", ex);
        }
    }

    @Transactional
    public String storeFile(MultipartFile file, String prefix, FileEnums.ImageType imageType) throws FileStorageException {
        validateFile(file);

        String fileName = generateFileName(file, prefix);
        try {
            Path targetLocation = pathSelector(imageType).resolve(fileName);

            // Create different sizes of the image
            BufferedImage originalImage = ImageIO.read(file.getInputStream());

            // Store standard size
            if(imageType.equals(FileEnums.ImageType.PRODUCT_DETAIL) || imageType.equals(FileEnums.ImageType.PRODUCT_CARD)) {
                saveResizedImage(originalImage, targetLocation,
                        storageConfig.getStandardSize());
            }
            // Store thumbnail size
            else {
                saveResizedImage(originalImage, targetLocation,
                        storageConfig.getThumbnailSize());
            }

            return fileName;
        } catch (IOException ex) {
            throw new FileStorageException("Could not store file " + fileName, ex);
        }
    }

    public Resource loadFileAsResource(String fileName) throws FileStorageException {
        try {
            Path logoPath = logoStorageLocation.resolve(fileName).normalize();
            Path productPath = productStorageLocation.resolve(fileName).normalize();
            Path reviewPath = reviewStorageLocation.resolve(fileName).normalize();
            Path userDpPath = userDPStorageLocation.resolve(fileName).normalize();
            Resource resource = null;

            if(logoPath.toFile().exists()){
                resource = new UrlResource(logoPath.toUri());
            }
            else if(productPath.toFile().exists()){
                resource = new UrlResource(productPath.toUri());
            }
            else if(userDpPath.toFile().exists()){
                resource = new UrlResource(userDpPath.toUri());
            }
            else if(reviewPath.toFile().exists()){
                resource = new UrlResource(reviewPath.toUri());
        }

            if (resource != null && resource.exists()) {
                return resource;
            }
        } catch (Exception ex) {
            throw new FileStorageException("File not found " + fileName, ex);
        }
        return null;
    }

    @Transactional
    public void deleteFile(String fileName) throws FileStorageException {
        try {
            Path logoPath = logoStorageLocation.resolve(fileName).normalize();
            Path productPath = productStorageLocation.resolve(fileName).normalize();
            Path reviewPath = reviewStorageLocation.resolve(fileName).normalize();
            Path userDpPath = userDPStorageLocation.resolve(fileName).normalize();

            if(logoPath.toFile().exists()){
                Files.deleteIfExists(logoPath);
            }
            else if(productPath.toFile().exists()){
                Files.deleteIfExists(productPath);
            }
            else if(reviewPath.toFile().exists()){
                Files.deleteIfExists(reviewPath);
            }
            else if(userDpPath.toFile().exists()){
                Files.deleteIfExists(userDpPath);
            }

        } catch (IOException ex) {
            throw new FileStorageException("Could not delete file " + fileName, ex);
        }
    }

    private void validateFile(MultipartFile file) throws FileStorageException {
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

    private Path pathSelector (FileEnums.ImageType imageType){
        switch (imageType){
            case REVIEW ->{
                return reviewStorageLocation;
            }
            case BRAND ->{
                return logoStorageLocation;
            }
            case USER_DP ->{
                return userDPStorageLocation;
            }
            case PRODUCT_CARD, PRODUCT_DETAIL ->{
                return productStorageLocation;
            }
            default -> throw new IllegalArgumentException("Invalid file type: " + imageType);
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
        String originalFileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
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