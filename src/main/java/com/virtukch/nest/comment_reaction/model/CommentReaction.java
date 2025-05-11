package com.virtukch.nest.comment_reaction.model;

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
public class CommentReaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentReactionId;

    @Column(nullable = false)
    private Long commentId;

    @Column(nullable = false)
    private Long memberId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ReactionType reactionType;

    @CreatedDate
    private String createdAt;

    @Builder
    public CommentReaction(Long commentId, Long memberId, ReactionType reactionType) {
        this.commentId = commentId;
        this.memberId = memberId;
        this.reactionType = reactionType;
    }

    //생성 편의 메서드
    public static CommentReaction createCommentReaction(Long commentId, Long memberId, ReactionType reactionType) {
        return CommentReaction.builder()
                .commentId(commentId)
                .memberId(memberId)
                .reactionType(reactionType)
                .build();
    }
}
