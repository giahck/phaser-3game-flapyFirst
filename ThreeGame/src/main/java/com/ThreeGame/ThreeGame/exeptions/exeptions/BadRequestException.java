package com.ThreeGame.ThreeGame.exeptions.exeptions;

public class BadRequestException extends RuntimeException {

    private final String[] details;

    public BadRequestException(String message, String... details) {
        super(message);
        this.details = details;
    }

    public String[] getDetails() {
        return details;
    }
}