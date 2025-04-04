package com.virtukch.nest.auth.exception;

public class EmailCannotSendException extends RuntimeException {

    public EmailCannotSendException() {
        super("Cannot send email");
    }

    public EmailCannotSendException(String message) {
        super(message);
    }
}
