package com.umesha_g.the_clique_backend.exception;

public class FileExceptions {
    public static class MaxImagesExceededException extends RuntimeException {
        public MaxImagesExceededException(String message) {
            super(message);
        }
    }

    public static class InvalidImageTypeException extends RuntimeException {
        public InvalidImageTypeException(String message) {
            super(message);
        }
    }

    public static class ProductCardImageExistsException extends RuntimeException {
        public ProductCardImageExistsException(String message) {
            super(message);
        }
    }
}