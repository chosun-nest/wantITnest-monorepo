package com.virtukch.nest.comment_reaction.repository;

import com.virtukch.nest.comment_reaction.model.ReactionType;
import com.virtukch.nest.comment_reaction.model.CommentReaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommentReactionRepository extends JpaRepository<CommentReaction, Long> {

    // 특정 회원이 특정 댓글에 한 반응을 조회
    Optional<CommentReaction> findByCommentIdAndMemberId(Long commentId, Long memberId);

    // 특정 회원이 특정 댓글에 특정 타입의 반응을 했는지 확인
    boolean existsByCommentIdAndMemberIdAndReactionType(Long commentId, Long memberId, ReactionType reactionType);

    // 특정 댓글에 대한 모든 반응 조회
    long countByCommentIdAndReactionType(Long commentId, ReactionType reactionType);

    // 특정 댓글의 특정 회원의 반응 삭제
    void deleteByCommentIdAndMemberId(Long commentId, Long memberId);

    // 특정 댓글에 대한 모든 반응 삭제
    void deleteAllByCommentId(Long commentId);
}