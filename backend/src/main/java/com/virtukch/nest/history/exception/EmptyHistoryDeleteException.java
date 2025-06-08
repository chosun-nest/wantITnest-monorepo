package com.virtukch.nest.history.exception;

public class EmptyHistoryDeleteException extends RuntimeException {

    public EmptyHistoryDeleteException(String message) {
        super(message);
    }
}
