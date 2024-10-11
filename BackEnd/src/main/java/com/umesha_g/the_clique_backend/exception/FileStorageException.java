package com.umesha_g.the_clique_backend.exception;

import java.io.IOException;

public class FileStorageException extends Throwable {
    public FileStorageException(String couldNotCreateUploadDirectory, IOException ex) {
        super(couldNotCreateUploadDirectory, ex);
    }

    public FileStorageException(String couldNotCreateUploadDirectory, Exception ex) {
        super(couldNotCreateUploadDirectory, ex);
    }
    public FileStorageException(String couldNotCreateUploadDirectory) {
        super(couldNotCreateUploadDirectory);
    }

}
