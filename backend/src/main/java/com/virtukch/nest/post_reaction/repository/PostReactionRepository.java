package com.virtukch.nest.post_reaction.repository;

import com.virtukch.nest.post_reaction.model.PostReaction;
import com.virtukch.nest.post_reaction.model.ReactionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostReactionRepository extends JpaRepository<PostReaction, Long> {
    Optional<PostReaction> findByPostIdAndMemberId(Long postId, Long memberId);

    long countByPostIdAndReactionType(Long postId, ReactionType reactionType);
}
