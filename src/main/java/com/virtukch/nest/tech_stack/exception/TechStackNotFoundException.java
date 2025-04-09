package com.virtukch.nest.tech_stack.exception;

public class TechStackNotFoundException extends RuntimeException {
    public TechStackNotFoundException(String message) {
        super(message);
    }

    public TechStackNotFoundException() {

    }
}
