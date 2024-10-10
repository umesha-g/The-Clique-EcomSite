package com.umesha_g.the_clique_backend.exception;

import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handle ResourceNotFoundException
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.NOT_FOUND,
                ex.getMessage()
        );
        problemDetail.setTitle("Resource Not Found");
        problemDetail.setProperty("timestamp", LocalDateTime.now());

        return new ResponseEntity<>(new CustomErrorResponse(HttpStatus.NOT_FOUND, problemDetail), HttpStatus.NOT_FOUND);
    }

    // Handle BadRequestException
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponse> handleBadRequestException(BadRequestException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
        problemDetail.setTitle("Bad Request");
        problemDetail.setProperty("timestamp", LocalDateTime.now());

        return new ResponseEntity<>(new CustomErrorResponse(HttpStatus.BAD_REQUEST, problemDetail), HttpStatus.BAD_REQUEST);
    }

    // Handle validation exceptions (MethodArgumentNotValidException)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        err -> Optional.ofNullable(err.getDefaultMessage()).orElse("Invalid value")
                ));

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                "Validation failed for one or more fields"
        );
        problemDetail.setTitle("Validation Error");
        problemDetail.setProperty("timestamp", LocalDateTime.now());
        problemDetail.setProperty("fieldErrors", errors);

        return new ResponseEntity<>(new CustomErrorResponse(HttpStatus.BAD_REQUEST, problemDetail), HttpStatus.BAD_REQUEST);
    }

    // Custom ErrorResponse implementation
    private static class CustomErrorResponse implements ErrorResponse {
        private final HttpStatusCode statusCode;
        private final ProblemDetail problemDetail;

        public CustomErrorResponse(HttpStatusCode statusCode, ProblemDetail problemDetail) {
            this.statusCode = statusCode;
            this.problemDetail = problemDetail;
        }

        @Override
        public HttpStatusCode getStatusCode() {
            return statusCode;
        }

        @Override
        public ProblemDetail getBody() {
            return problemDetail;
        }
    }
}
