package com.virtukch.nest.interest.exception;

public class InterestNotFoundException extends RuntimeException {

    public InterestNotFoundException() {
        super();
    }

    public InterestNotFoundException(String message) {
        super(message);
    }
}