package com.virtukch.nest.comment.controller;

import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.comment.dto.CommentListResponseDto;
import com.virtukch.nest.comment.dto.CommentRequestDto;
import com.virtukch.nest.comment.dto.CommentDeleteResponseDto;
import com.virtukch.nest.comment.dto.CommentResponseDto;
import com.virtukch.nest.comment.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/posts/{postId}/comments")
@Tag(
        name = "댓글 API",
        description = "게시글 상세 페이지에서 사용되는 댓글 생성, 조회, 수정, 삭제 API"
)
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @Operation(
            summary = "댓글 작성",
            description = """
                    특정 게시글에 댓글을 작성합니다.
                    - 인증된 사용자만 작성 가능
                    - 댓글 내용은 최대 500자까지 작성 가능
                    
                    요청 필드
                    - `content` (string, required): 댓글 내용 (최대 500자)
                    """,
            security = {@SecurityRequirement(name = "bearer-key")}
    )
    @PostMapping
    public ResponseEntity<CommentResponseDto> createComment(
            @PathVariable Long postId,
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody CommentRequestDto requestDto
    ) {
        CommentResponseDto response = commentService.createComment(postId, user.getMember().getMemberId(), requestDto);
        URI location = URI.create("/api/v1/posts/" + postId + "/comments/" + response.getCommentId());
        return ResponseEntity.created(location).body(response);
    }

    @Operation(
            summary = "댓글 목록 조회",
            description = "특정 게시글에 작성된 댓글 목록을 조회합니다.",
            security = {@SecurityRequirement(name = "bearer-key")}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "댓글 목록 조회 성공",
                    content = @Content(schema = @Schema(implementation = CommentListResponseDto.class)))
    })
    @GetMapping
    public ResponseEntity<CommentListResponseDto> getCommentList(@PathVariable Long postId) {
        return ResponseEntity.ok(commentService.getCommentList(postId));
    }

    @Operation(
            summary = "댓글 수정",
            description = """
                    특정 댓글의 내용을 수정합니다.
                    - 본인이 작성한 댓글만 수정할 수 있습니다.
                    - 댓글 내용은 최대 500자까지 작성할 수 있습니다.
                    """,
            security = {@SecurityRequirement(name = "bearer-key")}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "댓글 수정 성공",
                    content = @Content(schema = @Schema(implementation = CommentResponseDto.class)))
    })
    @PatchMapping("/{commentId}")
    public ResponseEntity<CommentResponseDto> updateComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody CommentRequestDto requestDto) {
        CommentResponseDto responseDto = commentService.updateComment(commentId, user.getMember().getMemberId(), requestDto);
        return ResponseEntity.ok(responseDto);
    }

    @Operation(
            summary = "댓글&대댓글 삭제",
            description = """
                    특정 댓글을 삭제합니다.
                    - 본인이 작성한 댓글만 삭제할 수 있습니다.
                    - 삭제 후 commentId와 메시지를 응답합니다.
                    """,
            security = {@SecurityRequirement(name = "bearer-key")}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "댓글 삭제 성공",
                    content = @Content(schema = @Schema(implementation = CommentDeleteResponseDto.class)))
    })
    @DeleteMapping("/{commentId}")
    public ResponseEntity<CommentDeleteResponseDto> deleteComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal CustomUserDetails user) {
        CommentDeleteResponseDto responseDto = commentService.deleteComment(commentId, user.getMember().getMemberId());
        return ResponseEntity.ok(responseDto);
    }

    @Operation(
            summary = "대댓글 작성",
            description = """
                    특정 댓글에 대한 답글(대댓글)을 작성합니다.
                    - 인증된 사용자만 작성 가능
                    - 댓글 내용은 최대 500자까지 작성 가능
                    """,
            security = {@SecurityRequirement(name = "bearer-key")}
    )
    @PostMapping("/{parentId}/reply")
    public ResponseEntity<CommentResponseDto> createReply(
            @PathVariable Long postId,
            @PathVariable Long parentId,
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody CommentRequestDto requestDto) {

        CommentResponseDto response = commentService.createReply(postId, parentId, user.getMember().getMemberId(), requestDto);
        return ResponseEntity
                .created(URI.create("/api/posts/" + postId + "/comments/" + response.getCommentId()))
                .body(response);
    }
}
