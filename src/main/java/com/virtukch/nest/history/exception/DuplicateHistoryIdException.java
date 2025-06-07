package com.virtukch.nest.history.exception;

public class DuplicateHistoryIdException extends RuntimeException {

    public DuplicateHistoryIdException(String message) {
        super(message);
    }
}
