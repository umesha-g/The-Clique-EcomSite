package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.exception.FileExceptions.MaxImagesExceededException;
import com.umesha_g.the_clique_backend.exception.FileExceptions.ProductCardImageExistsException;
import com.umesha_g.the_clique_backend.exception.FileStorageException;
import com.umesha_g.the_clique_backend.model.entity.FileReference;
import com.umesha_g.the_clique_backend.model.enums.FileEnums;
import com.umesha_g.the_clique_backend.model.enums.FileEnums.ImageType;
import com.umesha_g.the_clique_backend.repository.FileReferenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FileReferenceService {
    private final FileStorageService fileStorageService;
    private final FileReferenceRepository fileReferenceRepository;

    private static final int MAX_PRODUCT_IMAGES = 8;
    private static final int MAX_REVIEW_IMAGES = 4;

    @Transactional
    public FileReference saveFile(MultipartFile file, ImageType imageType, String entityId, boolean isCardImage) {
        validateImageUpload(imageType, entityId, isCardImage);

        try {
            String fileName = fileStorageService.storeFile(file,
                    imageType.toString().toLowerCase() + "_" + entityId);

            FileReference fileReference = new FileReference();
            fileReference.setFileName(fileName);
            fileReference.setFileType(file.getContentType());
            fileReference.setSize(file.getSize());
            fileReference.setImageType(imageType);
            fileReference.setEntityId(entityId);
            fileReference.setThumbnailUrl("/api/v1/files/thumb_" + fileName);
            fileReference.setStandardUrl("/api/v1/files/" + fileName);
            fileReference.setCardImage(isCardImage);

            // Set display order
            List<FileReference> existingFiles = getActiveFilesByEntity(imageType, entityId);
            fileReference.setDisplayOrder(existingFiles.size() + 1);

            return fileReferenceRepository.save(fileReference);
        } catch (Exception | FileStorageException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    private void validateImageUpload(ImageType imageType, String entityId, boolean isCardImage) {
        List<FileReference> existingFiles = getActiveFilesByEntity(imageType, entityId);

        if (imageType == ImageType.PRODUCT_DETAIL && existingFiles.size() >= MAX_PRODUCT_IMAGES) {
            throw new MaxImagesExceededException("Maximum product images limit reached");
        }

        if (imageType == ImageType.REVIEW && existingFiles.size() >= MAX_REVIEW_IMAGES) {
            throw new MaxImagesExceededException("Maximum review images limit reached");
        }

        if (isCardImage && existingFiles.stream().anyMatch(FileReference::isCardImage)) {
            throw new ProductCardImageExistsException("Product card image already exists");
        }
    }

    public List<FileReference> getActiveFilesByEntity(ImageType imageType, String entityId) {
        return fileReferenceRepository.findByImageTypeAndEntityIdAndStatusOrderByDisplayOrderAsc(
                imageType, entityId, FileEnums.ImageStatus.ACTIVE);
    }

    @Transactional
    public void updateDisplayOrder(String fileReferenceId, int newOrder) {
        FileReference fileReference = fileReferenceRepository.findById(fileReferenceId)
                .orElseThrow(() -> new RuntimeException("File reference not found"));

        List<FileReference> files = getActiveFilesByEntity(
                fileReference.getImageType(), fileReference.getEntityId());

        // Reorder files
        files.forEach(file -> {
            if (file.getDisplayOrder() >= newOrder &&
                    !file.getId().equals(fileReferenceId)) {
                file.setDisplayOrder(file.getDisplayOrder() + 1);
            }
        });

        fileReference.setDisplayOrder(newOrder);
        fileReferenceRepository.saveAll(files);
    }

    @Transactional
    public void deleteFile(String fileReferenceId) {
        FileReference fileReference = fileReferenceRepository.findById(fileReferenceId)
                .orElseThrow(() -> new RuntimeException("File reference not found"));

        try {
            fileStorageService.deleteFile(fileReference.getFileName());
            fileReferenceRepository.delete(fileReference);
        } catch (Exception | FileStorageException e) {
            throw new RuntimeException("Failed to delete file", e);
        }
    }

    public FileReference getFileReference(String fileReferenceId) {
      return fileReferenceRepository.findById(fileReferenceId).orElse(null);
    }

    public FileReference convertToCardImage(String fileId) {
        FileReference fileReference = fileReferenceRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File reference not found"));
        fileReference.setImageType(ImageType.PRODUCT_CARD);
        return fileReferenceRepository.save(fileReference);
    }
}