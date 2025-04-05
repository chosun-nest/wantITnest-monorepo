package com.virtukch.nest.comment.dto.converter;

import com.virtukch.nest.comment.dto.CommentCreateResponseDto;
import com.virtukch.nest.comment.dto.CommentResponseDto;
import com.virtukch.nest.comment.model.Comment;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class CommentDtoConverter {
    
    public static CommentCreateResponseDto toCreateResponseDto(Comment savedComment) {
        return CommentCreateResponseDto.builder()
                .commentId(savedComment.getCommentId())
                .message("댓글이 성공적으로 등록되었습니다.")
                .build();
    }
    
    public static CommentResponseDto toResponseDto(Comment comment) {
        return CommentResponseDto.builder()
                .commentId(comment.getCommentId())
                .content(comment.getCommentContent())
                .authorName(comment.getMember().getMemberName())
                .createdAt(timeFormat(comment.getCreatedAt()))
                .build();
    }
    
    private static String timeFormat(LocalDateTime dateTime) {
        return dateTime.format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm"));
    }
} 