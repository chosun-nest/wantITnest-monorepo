package com.virtukch.nest.comment.swagger;

import com.virtukch.nest.comment.dto.CommentDeleteResponseDto;
import io.swagger.v3.oas.annotations.Operation;
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
        summary = "댓글/대댓글 삭제",
        description = """
        특정 댓글 또는 대댓글을 삭제합니다.
        <br>
        - 본인이 작성한 댓글만 삭제할 수 있습니다.
        - 대댓글이 존재하는 부모 댓글은 **soft delete** 처리됩니다.
          (내용은 "삭제된 댓글입니다."로 변경되고, 자식 댓글은 유지됩니다.)
        - 대댓글이 없는 댓글은 **물리적으로 삭제(DB delete)** 됩니다.
        - 삭제 후 commentId와 메시지를 포함한 응답이 반환됩니다.
        """,
        security = {@SecurityRequirement(name = "bearer-key")}
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "댓글 삭제 성공",
                content = @Content(schema = @Schema(implementation = CommentDeleteResponseDto.class))
        ),
        @ApiResponse(
                responseCode = "403",
                description = "댓글 작성자가 아닌 경우 (삭제 권한 없음)"
        ),
        @ApiResponse(
                responseCode = "404",
                description = "존재하지 않는 댓글 ID"
        )
})
public @interface CommentDeleteOperation {
}
