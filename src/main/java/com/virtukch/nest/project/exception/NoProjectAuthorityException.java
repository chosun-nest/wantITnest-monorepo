package com.virtukch.nest.project.exception;

public class NoProjectAuthorityException extends RuntimeException{
    public NoProjectAuthorityException(Long projectId, Long memberId) {
        super(String.format("회원 [%d]은 게시글 [%d]에 대한 권한이 없습니다.", memberId, projectId));
    }
}
