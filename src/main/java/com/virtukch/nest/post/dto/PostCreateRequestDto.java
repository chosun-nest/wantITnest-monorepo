package com.virtukch.nest.post.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class PostCreateRequestDto {
    private String title;
    private String content;
    private List<String> tags;
}
