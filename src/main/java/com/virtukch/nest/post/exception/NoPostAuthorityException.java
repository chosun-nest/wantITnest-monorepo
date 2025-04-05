package com.virtukch.nest.post.exception;

public class NoPostAuthorityException extends RuntimeException {
    public NoPostAuthorityException(Long postId, Long memberId) {
        super(String.format("회원 [%d]은 게시글 [%d]에 대한 권한이 없습니다.", memberId, postId));
    }
}
