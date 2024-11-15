package com.umesha_g.the_clique_backend.dto.response;

import com.umesha_g.the_clique_backend.model.enums.FileEnums;
import lombok.Data;

@Data
public class FileRefResponse {

    private String id;
    private String standardUrl;
    private boolean isCardImage;
    private Integer displayOrder;
    private FileEnums.ImageStatus status;
}
