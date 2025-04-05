package com.virtukch.nest.post.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostDetailResponseDto {

    private Long postId;

    private String title;

    private String content;

    private List<String> tags;

    private AuthorDto author;

    private Integer viewCount;

    private String createdAt;
    private String updatedAt;

}
