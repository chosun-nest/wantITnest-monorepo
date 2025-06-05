package com.virtukch.nest.comment.controller;

import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.comment.dto.CommentDeleteResponseDto;
import com.virtukch.nest.comment.dto.CommentListResponseDto;
import com.virtukch.nest.comment.dto.CommentRequestDto;
import com.virtukch.nest.comment.dto.CommentResponseDto;
import com.virtukch.nest.comment.model.BoardType;
import com.virtukch.nest.comment.service.CommentService;
import com.virtukch.nest.comment.swagger.CommentCreateOperation;
import com.virtukch.nest.comment.swagger.CommentDeleteOperation;
import com.virtukch.nest.comment.swagger.CommentListOperation;
import com.virtukch.nest.comment_reaction.dto.CommentReactionRequestDto;
import com.virtukch.nest.comment_reaction.dto.CommentReactionResponseDto;
import com.virtukch.nest.comment_reaction.service.CommentReactionService;
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
        description = "게시판 모든 게시글 상세 페이지에서 공통으로 사용되는 댓글 관련 API"
)
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;
    private final CommentReactionService commentReactionService;

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

    @CommentDeleteOperation
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

    @Operation(
            summary = "댓글 좋아요/싫어요 반응 관리",
            description = """
                댓글에 좋아요 또는 싫어요 반응을 추가, 변경 또는 취소합니다.
                
                ### 주요 기능
                - 인증된 사용자만 댓글에 반응할 수 있습니다.
                - 한 사용자는 하나의 댓글에 하나의 반응만 가질 수 있습니다.
                - 같은 유형의 반응을 다시 보내면 반응이 취소됩니다(토글 방식).
                - 다른 유형의 반응을 보내면 기존 반응이 새로운 반응으로 변경됩니다.
                
                ### 요청 가능한 반응 유형
                - LIKE: 좋아요
                - DISLIKE: 싫어요
                
                ### 응답 정보
                - 반응 적용 후 해당 댓글의 최신 좋아요/싫어요 수가 반환됩니다.
                - 결과 메시지는 반응이 '추가', '변경', 또는 '취소' 되었는지 안내합니다.
                """,
            security = {@SecurityRequirement(name = "bearer-key")}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "댓글 반응 추가/변경/취소 성공",
                    content = @Content(schema = @Schema(implementation = CommentReactionResponseDto.class)))
    })
    @PostMapping("/{commentId}/reaction")
    public ResponseEntity<CommentReactionResponseDto> reactToComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody @Valid CommentReactionRequestDto requestDto
    ) {
        CommentReactionResponseDto responseDto = commentReactionService.reactToComment(
                commentId,
                user.getMember().getMemberId(),
                requestDto.getReactionType()
        );
        return ResponseEntity.ok(responseDto);
    }
}
