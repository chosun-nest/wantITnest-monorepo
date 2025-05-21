package com.virtukch.nest.post_reaction.service;

import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.member.repository.MemberRepository;
import com.virtukch.nest.post.model.Post;
import com.virtukch.nest.post.service.PostService;
import com.virtukch.nest.post_reaction.dto.PostReactionResponseDto;
import com.virtukch.nest.post_reaction.model.PostReaction;
import com.virtukch.nest.post_reaction.model.ReactionType;
import com.virtukch.nest.post_reaction.repository.PostReactionRepository;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class PostReactionService {

    private final PostService postService;
    private final MemberRepository memberRepository;
    private final PostReactionRepository postReactionRepository;

    @Transactional
    public PostReactionResponseDto reactToPost(Long postId, Long memberId, @NotNull ReactionType reactionType) {
        Post post = postService.findByIdOrThrow(postId);
        findMemberOrThrow(memberId);

        Optional<PostReaction> existingReaction = postReactionRepository.findByPostIdAndMemberId(postId, memberId);
        String msg;

        if (existingReaction.isPresent()) {
            PostReaction reaction = existingReaction.get();

            // 같은 유형의 반응이면 취소
            if (reaction.getReactionType() == reactionType) {
                postReactionRepository.delete(reaction);
                msg = "반응이 취소되었습니다.";
            }
            // 다른 유형의 반응이면 변경
            else {
                postReactionRepository.delete(reaction);
                PostReaction newReaction = PostReaction.createPostReaction(postId, memberId, reactionType);
                postReactionRepository.save(newReaction);
                msg = "반응이 변경되었습니다.";
            }
        } else {
            // 새로운 반응 생성
            PostReaction reaction = PostReaction.createPostReaction(postId, memberId, reactionType);
            postReactionRepository.save(reaction);
            msg = "반응이 추가되었습니다.";
        }

        updatePostReactionCounts(post);
        return createResponseDto(post, msg);
    }

    private void updatePostReactionCounts(Post post) {
        long likeCount = postReactionRepository.countByPostIdAndReactionType(post.getId(), ReactionType.LIKE);
        long dislikeCount = postReactionRepository.countByPostIdAndReactionType(post.getId(), ReactionType.DISLIKE);

        post.setLikeCount(likeCount);
        post.setDislikeCount(dislikeCount);
    }

    private Member findMemberOrThrow(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private PostReactionResponseDto createResponseDto(Post post, String message) {
        return PostReactionResponseDto.builder()
                .postId(post.getId())
                .likeCount(post.getLikeCount())
                .dislikeCount(post.getDislikeCount())
                .message(message)
                .build();
    }
}
