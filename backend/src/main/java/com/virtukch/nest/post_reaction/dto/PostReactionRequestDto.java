package com.virtukch.nest.post_reaction.dto;

import com.virtukch.nest.post_reaction.model.ReactionType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PostReactionRequestDto {
    @NotNull
    private ReactionType reactionType;
}
