package com.virtukch.nest.comment.swagger;

import com.virtukch.nest.comment.dto.CommentRequestDto;
import com.virtukch.nest.comment.dto.CommentResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Operation(
        summary = "댓글 작성",
        description = """
                특정 게시판(`boardType`)의 게시글(`postId`)에 댓글을 작성합니다.
                
                ✅ 인증된 사용자만 작성할 수 있으며, 댓글 본문은 최대 500자까지 입력 가능합니다.
                🔒 JWT 인증 필요
                
                📥 요청 필드:
                - `content` (string, required): 댓글 내용 (1자 이상, 500자 이하)
                """,
        security = {@SecurityRequirement(name = "bearer-key")},
        parameters = {
                @Parameter(name = "boardType", description = "게시판 종류 (예: INTEREST, PROJECT)", example = "INTEREST"),
                @Parameter(name = "postId", description = "게시글 ID", example = "42")
        },
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                required = true,
                description = "작성할 댓글 내용",
                content = @Content(
                        schema = @Schema(implementation = CommentRequestDto.class),
                        examples = {
                                @ExampleObject(
                                        name = "댓글 작성 예시",
                                        value = """
                                                {
                                                  "content": "이 글 정말 유익하네요. 감사합니다!"
                                                }
                                                """
                                )
                        }
                )
        ),
        responses = {
                @ApiResponse(
                        responseCode = "201",
                        description = "댓글 작성 성공",
                        content = @Content(schema = @Schema(implementation = CommentResponseDto.class))
                )
        }
)
public @interface CommentCreateOperation {
}
