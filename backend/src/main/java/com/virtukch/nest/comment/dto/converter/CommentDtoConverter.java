package com.virtukch.nest.comment.dto.converter;

import com.virtukch.nest.common.dto.AuthorDto;
import com.virtukch.nest.comment.dto.CommentDeleteResponseDto;
import com.virtukch.nest.comment.dto.CommentListResponseDto;
import com.virtukch.nest.comment.dto.CommentResponseDto;
import com.virtukch.nest.comment.model.Comment;
import com.virtukch.nest.common.dto.PageInfoDto;
import com.virtukch.nest.member.model.Member;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class CommentDtoConverter {

    public static CommentResponseDto toResponseDto(Comment comment, Member member) {
        return CommentResponseDto.builder()
                .commentId(comment.getCommentId())
                .content(comment.getCommentContent())
                .author(AuthorDto.create(member))
                .createdAt(timeFormat(comment.getCreatedAt()))
                .updatedAt(timeFormat(comment.getUpdatedAt()))
                .parentId(comment.getParentId())
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

    public static CommentListResponseDto toCommentList(List<CommentResponseDto> comments, Page<Comment> page) {
        return CommentListResponseDto.builder()
                .comments(comments)
                .totalCount(comments.size())
                .pageInfo(PageInfoDto.create(page))
                .build();
    }

    private static String timeFormat(LocalDateTime dateTime) {
        return dateTime.format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm"));
    }
} 