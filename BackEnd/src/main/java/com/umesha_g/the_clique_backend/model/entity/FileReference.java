package com.umesha_g.the_clique_backend.model.entity;

import com.umesha_g.the_clique_backend.model.enums.FileEnums.ImageStatus;
import com.umesha_g.the_clique_backend.model.enums.FileEnums.ImageType;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class FileReference {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String fileName;
    private String fileType;
    private String entityId;
    private long size;
    private String thumbnailUrl;
    private String standardUrl;

    @Enumerated(EnumType.STRING)
    private ImageType imageType;

    @Enumerated(EnumType.STRING)
    private ImageStatus status = ImageStatus.ACTIVE;

    private boolean isCardImage = false;
    private Integer displayOrder;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

}