package com.virtukch.nest.comment.dto;

import com.virtukch.nest.post.dto.AuthorDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class CommentResponseDto {
    private Long commentId;
    private String content;
    private AuthorDto author;
    private String createdAt;
    private String updatedAt;
    private Long parentId;

    private Long likeCount;
    private Long dislikeCount;

    private Boolean isDeleted;

    @Builder.Default
    private List<CommentResponseDto> children = new ArrayList<>();
}

