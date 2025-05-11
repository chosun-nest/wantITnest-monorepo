package com.virtukch.nest.comment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class CommentRequestDto {

    @NotBlank(message = "댓글 내용은 비어 있을 수 없습니다.")
    @Size(min = 1, max = 500, message = "댓글은 최대 500자까지 작성할 수 있습니다.")
    private String content;
}

