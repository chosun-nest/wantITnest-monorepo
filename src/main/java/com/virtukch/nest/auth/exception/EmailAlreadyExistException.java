package com.virtukch.nest.auth.exception;

public class EmailAlreadyExistException extends RuntimeException {

    public EmailAlreadyExistException() {
        super("Email already exists");
    }

    public EmailAlreadyExistException(String message) {
        super(message);
    }
}
