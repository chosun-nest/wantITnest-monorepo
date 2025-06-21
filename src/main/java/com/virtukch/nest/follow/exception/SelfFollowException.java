package com.virtukch.nest.follow.exception;

public class SelfFollowException extends FollowException {
    
    public SelfFollowException() {
        super("자기 자신을 팔로우할 수 없습니다.");
    }
    
    public SelfFollowException(String message) {
        super(message);
    }
}
