package com.virtukch.nest.comment_reaction.dto;

import com.virtukch.nest.comment_reaction.model.ReactionType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CommentReactionRequestDto {
    @NotNull
    private ReactionType reactionType;
}