package com.virtukch.nest.comment_reaction.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CommentReactionResponseDto {
    private Long commentId;
    private Long likeCount;
    private Long dislikeCount;
    private String message;
}