package com.ThreeGame.ThreeGame.exeptions.exeptions;

public class UnauthorizedException extends RuntimeException{

    public UnauthorizedException(String msg){
        super(msg);
    }
}