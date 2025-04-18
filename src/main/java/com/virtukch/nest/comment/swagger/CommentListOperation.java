package com.virtukch.nest.comment.swagger;


import com.virtukch.nest.comment.dto.CommentListResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Operation(
        summary = "댓글 목록 조회",
        description = """
                특정 게시판 타입(`boardType`)과 게시글 ID(`postId`)에 해당하는 모든 댓글을 계층 구조(대댓글 포함)로 조회합니다.
                
                📌 댓글은 작성 시간 기준으로 정렬되며, soft-delete된 댓글은 '삭제된 댓글입니다' 형태로 반환됩니다.
                📌 대댓글이 없는 댓글은 hard-delete 되어 DB에서 삭제됩니다.
                """,
        security = {@SecurityRequirement(name = "bearer-key")},
        parameters = {
                @Parameter(name = "boardType", description = "게시판 종류 (예: TOPIC, PROJECT)", example = "TOPIC"),
                @Parameter(name = "postId", description = "게시글 ID", example = "42")
        }
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "댓글 목록 조회 성공",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(implementation = CommentListResponseDto.class)
                )
        )
})
public @interface CommentListOperation {
}
