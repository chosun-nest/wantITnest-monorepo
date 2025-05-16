package com.virtukch.nest.post.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

import java.util.List;

@Getter
public class PostRequestDto {
    @NotBlank(message = "게시글 제목은 비어 있을 수 없습니다.")
    private String title;
    private String content;
    private List<String> tags;
}
