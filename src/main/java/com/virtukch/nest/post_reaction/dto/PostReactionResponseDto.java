package com.virtukch.nest.post_reaction.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PostReactionResponseDto {
    private Long postId;
    private Long likeCount;
    private Long dislikeCount;
    private String message;
}
