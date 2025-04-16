package com.virtukch.nest.comment.model;

import com.virtukch.nest.common.model.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentId;

    private Long postId;

    private Long memberId;

    @Column(length = 500, nullable = false)
    private String commentContent;

    @Column
    private Long parentId; // 대댓글용, null이면 일반 댓글

    @Column(nullable = false)
    private boolean isDeleted = false;


    // 생성 편의 메서드
    public static Comment createComment(Long postId, Long memberId, String content) {
        return Comment.builder()
                .postId(postId)
                .memberId(memberId)
                .commentContent(content)
                .parentId(null)
                .build();
    }

    public static Comment createReply(Long postId, Long memberId, String content, Long parentId) {
        return Comment.builder()
                .postId(postId)
                .memberId(memberId)
                .commentContent(content)
                .parentId(parentId)
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
}