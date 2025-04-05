package com.virtukch.nest.comment.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.virtukch.nest.comment.dto.CommentCreateResponseDto;
import com.virtukch.nest.comment.dto.CommentCreateRequestDto;
import com.virtukch.nest.comment.dto.converter.CommentDtoConverter;
import com.virtukch.nest.comment.model.Comment;
import com.virtukch.nest.comment.repository.CommentRepository;
import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.post.model.Post;
import com.virtukch.nest.post.service.PostService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostService postService;

    @Transactional
    public CommentCreateResponseDto createComment(Long postId, Member member, CommentCreateRequestDto requestDto) {
        Post post = postService.findByIdOrThrow(postId);

        Comment comment = Comment.createComment(post, member, requestDto.getContent());
        Comment savedComment = commentRepository.save(comment);
        return CommentDtoConverter.toCreateResponseDto(savedComment);
    }
}
