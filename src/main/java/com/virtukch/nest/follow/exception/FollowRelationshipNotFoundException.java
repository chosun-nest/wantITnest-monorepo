package com.virtukch.nest.follow.exception;

public class FollowRelationshipNotFoundException extends FollowException {
    
    public FollowRelationshipNotFoundException() {
        super("팔로우 관계가 존재하지 않습니다.");
    }
    
    public FollowRelationshipNotFoundException(String message) {
        super(message);
    }
}
