package com.virtukch.nest.history.exception;

public class HistoryAccessDeniedException extends RuntimeException {

    public HistoryAccessDeniedException(String message) {
        super(message);
    }
}
