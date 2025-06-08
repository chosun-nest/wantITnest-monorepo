package com.virtukch.nest.history.exception;

public class EmptyHistoryUpdateException extends RuntimeException {

    public EmptyHistoryUpdateException(String message) {
        super(message);
    }
}
