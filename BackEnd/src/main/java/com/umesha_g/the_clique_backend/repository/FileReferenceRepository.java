package com.umesha_g.the_clique_backend.repository;

import com.umesha_g.the_clique_backend.model.entity.FileReference;
import com.umesha_g.the_clique_backend.model.enums.FileEnums;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileReferenceRepository extends JpaRepository<FileReference,String> {

    List<FileReference> findByImageTypeAndEntityIdAndStatusOrderByDisplayOrderAsc(
            FileEnums.ImageType imageType, String entityId, FileEnums.ImageStatus imageStatus);

}
