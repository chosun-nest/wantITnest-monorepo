package com.virtukch.nest.history.exception;

public class DuplicateHistoryCreationException extends RuntimeException {

    public DuplicateHistoryCreationException(String message) {
        super(message);
    }
}
