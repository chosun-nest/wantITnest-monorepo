package com.virtukch.nest.comment.exception;

import com.virtukch.nest.comment.model.BoardType;

public class InvalidBoardTypeException extends RuntimeException {
    public InvalidBoardTypeException(BoardType boardType) {
        super("지원하지 않는 게시판 타입입니다: " + boardType);
    }
    
    public InvalidBoardTypeException(String message) {
        super(message);
    }
}
