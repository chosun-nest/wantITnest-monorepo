package com.virtukch.nest.comment_reaction.service;

import com.virtukch.nest.comment.model.Comment;
import com.virtukch.nest.comment.service.CommentService;
import com.virtukch.nest.comment_reaction.dto.CommentReactionResponseDto;
import com.virtukch.nest.comment_reaction.model.CommentReaction;
import com.virtukch.nest.comment_reaction.model.ReactionType;
import com.virtukch.nest.comment_reaction.repository.CommentReactionRepository;
import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class CommentReactionService {
    private final CommentReactionRepository commentReactionRepository;
    private final CommentService commentService;
    private final MemberRepository memberRepository;

    /**
     * 댓글에 좋아요/싫어요 반응을 추가하거나 변경합니다.
     * <p>
     * - 이미 같은 유형의 반응이 있으면 취소합니다. <br>
     * - 다른 유형의 반응이 있으면 변경합니다. <br>
     * - 반응이 없으면 새로 추가합니다. <br>
     * </p>
     *
     * @param commentId 반응할 댓글의 ID
     * @param memberId 반응하는 사용자의 ID
     * @param reactionType 반응 유형 (좋아요/싫어요)
     * @return 업데이트된 댓글 반응 정보
     */
    @Transactional
    public CommentReactionResponseDto reactToComment(Long commentId, Long memberId, ReactionType reactionType) {
        // 댓글과 사용자 존재 확인
        Comment comment = commentService.findByIdOrThrow(commentId);
        findMemberOrThrow(memberId);

        // 기존 반응 조회
        Optional<CommentReaction> existingReaction = commentReactionRepository.findByCommentIdAndMemberId(commentId, memberId);

        if (existingReaction.isPresent()) {
            CommentReaction reaction = existingReaction.get();

            // 같은 유형의 반응이면 취소
            if (reaction.getReactionType() == reactionType) {
                commentReactionRepository.delete(reaction);
                updateCommentReactionCounts(comment);
                return createResponseDto(comment, "반응이 취소되었습니다.");
            }
            // 다른 유형의 반응이면 변경
            else {
                commentReactionRepository.delete(reaction);
                CommentReaction newReaction = CommentReaction.createCommentReaction(commentId, memberId, reactionType);
                commentReactionRepository.save(newReaction);
                updateCommentReactionCounts(comment);
                return createResponseDto(comment, "반응이 변경되었습니다.");
            }
        } else {
            // 새로운 반응 생성
            CommentReaction newReaction = CommentReaction.createCommentReaction(commentId, memberId, reactionType);
            commentReactionRepository.save(newReaction);
            updateCommentReactionCounts(comment);
            return createResponseDto(comment, "반응이 추가되었습니다.");
        }
    }

    /**
     * 특정 댓글에 대한 사용자의 반응을 조회합니다.
     *
     * @param commentId 조회할 댓글의 ID
     * @param memberId 조회할 사용자의 ID
     * @return 댓글 반응 정보 또는 null (반응이 없는 경우)
     */
    @Transactional(readOnly = true)
    public Optional<CommentReaction> getUserReaction(Long commentId, Long memberId) {
        return commentReactionRepository.findByCommentIdAndMemberId(commentId, memberId);
    }

    /**
     * 특정 댓글에 대한 좋아요/싫어요 수를 업데이트합니다.
     * 이 메서드는 DB에서 좋아요/싫어요 수를 조회하여 댓글 엔티티에 반영합니다.
     *
     * @param comment 업데이트할 댓글 객체
     */
    private void updateCommentReactionCounts(Comment comment) {
        long likeCount = commentReactionRepository.countByCommentIdAndReactionType(comment.getCommentId(), ReactionType.LIKE);
        long dislikeCount = commentReactionRepository.countByCommentIdAndReactionType(comment.getCommentId(), ReactionType.DISLIKE);

         comment.setLikeCount(likeCount);
         comment.setDislikeCount(dislikeCount);
    }

    /**
     * 댓글 반응 응답 DTO를 생성합니다.
     *
     * @param comment 댓글 객체
     * @param message 응답 메시지
     * @return 댓글 반응 응답 DTO
     */
    private CommentReactionResponseDto createResponseDto(Comment comment, String message) {
        return CommentReactionResponseDto.builder()
                .commentId(comment.getCommentId())
                .likeCount(comment.getLikeCount())
                .dislikeCount(comment.getDislikeCount())
                .message(message)
                .build();
    }

    /**
     * 사용자 ID로 사용자를 조회하고, 없으면 예외를 발생시킵니다.
     *
     * @param memberId 조회할 사용자 ID
     * @return 조회된 사용자 객체
     * @throws RuntimeException 사용자가 존재하지 않는 경우
     */
    private Member findMemberOrThrow(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}