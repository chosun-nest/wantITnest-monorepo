package com.virtukch.nest.comment.model;

import com.virtukch.nest.common.model.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentId;

    private BoardType boardType;
    private Long postId;

    private Long memberId;

    @Column(length = 500, nullable = false)
    private String commentContent;

    @Column
    private Long parentId; // 대댓글용, null이면 일반 댓글

    @Column(nullable = false)
    private boolean isDeleted = false;

    @Setter
    @Column(nullable = false, columnDefinition = "BIGINT DEFAULT 0")
    private Long likeCount = 0L;

    @Setter
    @Column(nullable = false, columnDefinition = "BIGINT DEFAULT 0")
    private Long dislikeCount = 0L;

    // 생성 편의 메서드
    public static Comment createComment(BoardType boardType, Long postId, Long memberId, String content) {
        return Comment.builder()
                .boardType(boardType)
                .postId(postId)
                .memberId(memberId)
                .commentContent(content)
                .parentId(null)
                .likeCount(0L)
                .dislikeCount(0L)
                .build();
    }

    public static Comment createReply(BoardType boardType, Long postId, Long memberId, String content, Long parentId) {
        return Comment.builder()
                .boardType(boardType)
                .postId(postId)
                .memberId(memberId)
                .commentContent(content)
                .parentId(parentId)
                .likeCount(0L)
                .dislikeCount(0L)
                .build();
    }

    // 비즈니스 로직
    public void update(String commentContent) {
        if(commentContent != null && !commentContent.isBlank()) {
            this.commentContent = commentContent;
        }
    }

    public void delete() {
        this.isDeleted = true;
        this.commentContent = "삭제된 댓글입니다.";
    }

    public void increaseLikeCount() {
        this.likeCount += 1;
    }

    public void increaseDislikeCount() {
        this.dislikeCount += 1;
    }
}