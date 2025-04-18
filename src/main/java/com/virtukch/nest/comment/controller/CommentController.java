package com.virtukch.nest.comment.controller;

import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.comment.dto.*;
import com.virtukch.nest.comment.model.BoardType;
import com.virtukch.nest.comment.service.CommentService;
import com.virtukch.nest.comment.swagger.CommentCreateOperation;
import com.virtukch.nest.comment.swagger.CommentListOperation;
import com.virtukch.nest.comment.swagger.CommentReactionOperation;
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
@RequestMapping("/api/v1/{boardType}/{postId}/comments")
@Tag(
        name = "[모든 게시판 공통] 댓글 API",
        description = "게시판 모든 게시글 상세 페이지에서 공통으로 사용되는 댓글 관련 API입니다."
)
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @CommentCreateOperation
    @PostMapping
    public ResponseEntity<CommentResponseDto> createComment(
            @PathVariable BoardType boardType,
            @PathVariable Long postId,
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody CommentRequestDto requestDto) {
        CommentResponseDto response = commentService.createComment(boardType, postId, user.getMember().getMemberId(), requestDto);
        URI location = URI.create("/api/v1/" + boardType + "/" + postId + "/comments/" + response.getCommentId());
        return ResponseEntity.created(location).body(response);
    }

    @CommentListOperation
    @GetMapping
    public ResponseEntity<CommentListResponseDto> getCommentList(@PathVariable BoardType boardType, @PathVariable Long postId) {
        return ResponseEntity.ok(commentService.getCommentList(boardType, postId));
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
            @PathVariable BoardType boardType,
            @PathVariable Long postId,
            @PathVariable Long parentId,
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody CommentRequestDto requestDto) {

        CommentResponseDto response = commentService.createReply(boardType, postId, parentId, user.getMember().getMemberId(), requestDto);
        return ResponseEntity
                .created(URI.create("/api/posts/" + postId + "/comments/" + response.getCommentId()))
                .body(response);
    }

    @CommentReactionOperation
    @PostMapping("/{commentId}/reaction")
    public ResponseEntity<CommentReactionResponseDto> reactToComment(
            @PathVariable BoardType boardType,
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody @Valid CommentReactionRequestDto requestDto
    ) {
        CommentReactionResponseDto responseDto = commentService.reactToComment(
                commentId,
                user.getMember().getMemberId(),
                requestDto.getReactionType()
        );
        return ResponseEntity.ok(responseDto);
    }
}
