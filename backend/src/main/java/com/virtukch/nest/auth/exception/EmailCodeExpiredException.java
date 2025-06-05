package com.virtukch.nest.auth.exception;

public class EmailCodeExpiredException extends RuntimeException {

    public EmailCodeExpiredException() {
        super("Email Code Expired");
    }

    public EmailCodeExpiredException(String message) {
        super(message);
    }
}
