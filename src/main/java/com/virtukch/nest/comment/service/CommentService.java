package com.virtukch.nest.comment.service;

import com.virtukch.nest.comment.dto.CommentDeleteResponseDto;
import com.virtukch.nest.comment.dto.CommentListResponseDto;
import com.virtukch.nest.comment.dto.CommentRequestDto;
import com.virtukch.nest.comment.dto.CommentResponseDto;
import com.virtukch.nest.comment.dto.converter.CommentDtoConverter;
import com.virtukch.nest.comment.exception.CannotDeleteCommentException;
import com.virtukch.nest.comment.exception.CommentNotFoundException;
import com.virtukch.nest.comment.exception.NoCommentAuthorityException;
import com.virtukch.nest.comment.model.Comment;
import com.virtukch.nest.comment.repository.CommentRepository;
import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.post.model.Post;
import com.virtukch.nest.post.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@Slf4j
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostService postService;

    @Transactional
    public CommentResponseDto createComment(Long postId, Member member, CommentRequestDto requestDto) {
        Post post = postService.findByIdOrThrow(postId);

        Comment comment = Comment.createComment(post, member, requestDto.getContent());
        Comment savedComment = commentRepository.save(comment);
        return CommentDtoConverter.toResponseDto(savedComment);
    }

    @Transactional(readOnly = true)
    public CommentListResponseDto getCommentList(Long postId) {
        List<CommentResponseDto> responseDtos = commentRepository.findByPostIdOrderByCommentIdAsc(postId)
                .stream().map(CommentDtoConverter::toResponseDto).toList();
        return CommentDtoConverter.toCommentList(responseDtos);
    }

    @Transactional
    public CommentResponseDto updateComment(Long commentId, Member member, CommentRequestDto requestDto) {
        Comment comment = validateCommentOwnershipAndGet(commentId, member.getMemberId());
        comment.updateComment(requestDto.getContent());
        return CommentDtoConverter.toResponseDto(comment);
    }

    @Transactional
    public CommentDeleteResponseDto deleteComment(Long commentId, Member member) {
        Comment comment = validateCommentOwnershipAndGet(commentId, member.getMemberId());
        try {
            commentRepository.delete(comment);
        } catch (DataIntegrityViolationException e) { //TODO 추후 대댓글 기능 추가 시 고려하여 수정 필요.
            log.warn("댓글 삭제 중 무결성 예외 발생: commentId={}, memberId={}", commentId, member.getMemberId());
            throw new CannotDeleteCommentException(commentId);
        }
        return CommentDtoConverter.toDeleteResponseDto(comment);
    }

    @Transactional(readOnly = true)
    public Comment findByIdOrThrow(Long commentId) {
        return commentRepository.findById(commentId).orElseThrow(() -> new CommentNotFoundException(commentId));
    }

    @Transactional(readOnly = true)
    public Comment validateCommentOwnershipAndGet(Long commentId, Long memberId) {
        Comment comment = findByIdOrThrow(commentId);
        if (!Objects.equals(comment.getMember().getMemberId(), memberId)) {
            throw new NoCommentAuthorityException(commentId, memberId);
        }
        return comment;
    }
}
