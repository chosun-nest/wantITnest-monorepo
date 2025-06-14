package com.virtukch.nest.follow.exception;

public class AlreadyFollowingException extends FollowException {
    
    public AlreadyFollowingException() {
        super("이미 팔로우 중인 사용자입니다.");
    }
    
    public AlreadyFollowingException(String message) {
        super(message);
    }
}
