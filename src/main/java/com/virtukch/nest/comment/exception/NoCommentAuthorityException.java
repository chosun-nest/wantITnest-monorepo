package com.virtukch.nest.comment.exception;

public class NoCommentAuthorityException extends RuntimeException {
    public NoCommentAuthorityException(Long commentId, Long memberId) {
        super("해당 댓글에 대한 권한이 없습니다. commentId=" + commentId + ", memberId=" + memberId);
    }
}
