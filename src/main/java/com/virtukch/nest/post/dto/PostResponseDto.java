package com.virtukch.nest.post.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class PostResponseDto {
    private Long postId;
    private String message;
}
