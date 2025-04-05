package com.virtukch.nest.comment.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.comment.dto.CommentCreateResponseDto;
import com.virtukch.nest.comment.dto.CommentCreateRequestDto;
import com.virtukch.nest.comment.service.CommentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/posts/{postId}/comments")
@Tag(
        name = "댓글 API",
        description = """
                게시글 상세 페이지에서 사용되는 댓글 관련 API입니다.
                댓글 생성, 조회, 수정, 삭제 기능을 제공합니다.
                """
)
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @Operation(
            summary = "댓글 작성",
            description = """
                    특정 게시글에 댓글을 작성합니다.
                    
                    요청 필드
                    - `content` (string, required): 댓글 내용 (최대 500자)
                    """,
            security = {@SecurityRequirement(name = "bearer-key")}
    )
    @PostMapping("/new")
    public ResponseEntity<CommentCreateResponseDto> createComment(
            @PathVariable Long postId,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CommentCreateRequestDto requestDto
    ) {
        CommentCreateResponseDto response = commentService.createComment(postId, userDetails.getMember(), requestDto);
        return ResponseEntity.ok(response);
    }
}
