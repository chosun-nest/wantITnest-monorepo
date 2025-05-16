package com.virtukch.nest.comment.dto.converter;

import com.virtukch.nest.comment.dto.CommentDeleteResponseDto;
import com.virtukch.nest.comment.dto.CommentListResponseDto;
import com.virtukch.nest.comment.dto.CommentResponseDto;
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
                .likeCount(comment.getLikeCount())
                .dislikeCount(comment.getDislikeCount())
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
    
    private static String timeFormat(LocalDateTime dateTime) {
        return dateTime.format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm"));
    }
} 