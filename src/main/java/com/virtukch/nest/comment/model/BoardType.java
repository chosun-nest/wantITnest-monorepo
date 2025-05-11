package com.virtukch.nest.comment.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "게시판 타입")
public enum BoardType {
    @Schema(description = "관심분야 정보 게시판")
    TOPIC,

    @Schema(description = "프로젝트 모집 게시판")
    PROJECT;

    @JsonCreator
    public static BoardType from(String input) {
        return BoardType.valueOf(input.toUpperCase());
    }
}
