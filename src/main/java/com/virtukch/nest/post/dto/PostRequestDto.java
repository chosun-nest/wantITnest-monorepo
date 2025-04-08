package com.virtukch.nest.post.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

import java.util.List;

@Getter
public class PostRequestDto {
    @NotBlank
    private String title;
    private String content;
    private List<String> tags;
}
