package com.virtukch.nest.comment.dto.converter;

import com.virtukch.nest.comment.dto.*;
import com.virtukch.nest.comment.model.Comment;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class CommentDtoConverter {

    public static CommentResponseDto toResponseDto(Comment comment, String memberName) {
        return CommentResponseDto.builder()
                .commentId(comment.getCommentId())
                .content(comment.getCommentContent())
                .authorName(memberName)
                .createdAt(timeFormat(comment.getCreatedAt()))
                .updatedAt(timeFormat(comment.getUpdatedAt()))
                .isDeleted(comment.isDeleted())
                .build();
    }

    public static CommentDeleteResponseDto toDeleteResponseDto(Comment comment) {
        return CommentDeleteResponseDto.builder()
                .commentId(comment.getCommentId())
                .message("댓글이 성공적으로 삭제되었습니다.")
                .build();
    }

    public static CommentListResponseDto toCommentList(List<CommentResponseDto> comments) {
        return CommentListResponseDto.builder()
                .comments(comments)
                .totalCount(comments.size())
                .build();
    }

    public static CommentReactionResponseDto toReactionResponseDto(Comment comment, ReactionType reactionType) {
        return CommentReactionResponseDto.builder()
                .commentId(comment.getCommentId())
                .likeCount(comment.getLikeCount())
                .dislikeCount(comment.getDislikeCount())
                .message(reactionType + " 처리 완료")
                .build();
    }
    
    private static String timeFormat(LocalDateTime dateTime) {
        return dateTime.format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm"));
    }
} 