package com.virtukch.nest.post.exception;

import com.virtukch.nest.comment.model.BoardType;

public class PostNotFoundException extends RuntimeException {
    public PostNotFoundException(Long postId) {
        super(String.format("게시글을 찾을 수 없습니다. ID: %d", postId));
    }

    public PostNotFoundException(BoardType type, Long postId) {
        super(String.format(type + "게시글을 찾을 수 없습니다. ID: %d", postId));
    }
}