package com.virtukch.nest.post_reaction.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Getter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class PostReaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long postReactionId;

    @Column(nullable = false)
    private Long postId;

    @Column(nullable = false)
    private Long memberId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ReactionType reactionType;

    @CreatedDate
    private String createdAt;

    @Builder
    public PostReaction(Long postId, Long memberId, ReactionType reactionType) {
        this.postId = postId;
        this.memberId = memberId;
        this.reactionType = reactionType;
    }

    //생성 편의 메서드
    public static PostReaction createPostReaction(Long postId, Long memberId, ReactionType reactionType) {
        return PostReaction.builder()
                .postId(postId)
                .memberId(memberId)
                .reactionType(reactionType)
                .build();
    }
}
