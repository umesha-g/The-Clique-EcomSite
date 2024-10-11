package com.umesha_g.the_clique_backend.exception;

public class ResourceNotFoundException extends Throwable {
    public ResourceNotFoundException(String imageNotFound) {
    }

    public ResourceNotFoundException(String category, String type, String id) {
    }
}
