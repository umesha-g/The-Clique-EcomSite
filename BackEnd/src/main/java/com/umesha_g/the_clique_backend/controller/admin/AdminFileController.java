package com.umesha_g.the_clique_backend.controller.admin;

import com.umesha_g.the_clique_backend.dto.response.FileUploadResponse;
import com.umesha_g.the_clique_backend.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/v1/admin/files")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminFileController {
    private final FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<FileUploadResponse> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "prefix", defaultValue = "product") String prefix) {

        String fileName = fileStorageService.storeFile(file, prefix);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/v1/files/")
                .path(fileName)
                .toUriString();

        return ResponseEntity.ok(new FileUploadResponse(fileName, fileDownloadUri,
                file.getContentType(), file.getSize()));
    }

    @DeleteMapping("/{fileName:.+}")
    public ResponseEntity<Void> deleteFile(@PathVariable String fileName) {
        fileStorageService.deleteFile(fileName);
        return ResponseEntity.noContent().build();
    }
}