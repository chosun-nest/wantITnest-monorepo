package com.virtukch.nest.comment.swagger;

import com.virtukch.nest.comment_reaction.dto.CommentReactionRequestDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.ExampleObject;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Operation(
        summary = "댓글 좋아요/싫어요 등록 또는 취소",
        description = """
                특정 게시판(boardType)의 게시글(postId)에 달린 댓글(commentId)에 대해
                회원이 '좋아요' 또는 '싫어요' 반응을 등록하거나, 이미 등록된 반응을 취소합니다.
                같은 타입으로 두 번 요청하면 반응이 취소됩니다 (토글 방식).
                """,
        security = @SecurityRequirement(name = "bearer-key"),
        parameters = {
                @Parameter(name = "boardType", description = "게시판 종류 (예: INTEREST, PROJECT)", example = "INTEREST"),
                @Parameter(name = "postId", description = "게시글 ID", example = "12"),
                @Parameter(name = "commentId", description = "댓글 ID", example = "34")
        },
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "사용자의 반응 타입 (LIKE 또는 DISLIKE)",
                required = true,
                content = @Content(
                        schema = @Schema(implementation = CommentReactionRequestDto.class),
                        examples = {
                                @ExampleObject(name = "좋아요 예시", value = "{\"reactionType\": \"LIKE\"}"),
                                @ExampleObject(name = "싫어요 예시", value = "{\"reactionType\": \"DISLIKE\"}")
                        }
                )
        )
)
public @interface CommentReactionOperation {
}