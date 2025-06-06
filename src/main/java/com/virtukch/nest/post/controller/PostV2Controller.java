package com.virtukch.nest.post.controller;

import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.post.dto.PostResponseDto;
import com.virtukch.nest.post.dto.PostWithImagesRequestDto;
import com.virtukch.nest.post.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v2/posts")
@Tag(name = "[관심분야 정보 게시판 with image] 게시글 API", description = "이미지를 포함한 게시글 생성, 조회, 수정, 삭제 등 게시판 관련 API")
public class PostV2Controller {

    private final PostService postService;

    @Operation(
            summary = "게시글 작성 (이미지 포함)",
            description = """
                이미지를 포함한 게시글을 작성합니다. (multipart/form-data 형식)
                
                ## 요청 형식
                - Content-Type: multipart/form-data
                - 모든 필드는 form-data로 전송해야 합니다.
                
                ## 필드 설명
                - `title`: 게시글 제목 (필수, 빈 문자열 또는 null 값 불가)
                - `content`: 게시글 내용 (빈 문자열은 허용, null 값은 빈 문자열로 간주)
                - `tags`: 태그 목록 (태그 목록에 존재하는 태그만 설정 가능)
                - `images`: 업로드할 이미지 파일들 (선택사항)
                
                ## 중요 주의사항
                ⚠️ **Swagger UI에서 테스트 시 오류가 발생할 수 있습니다.**
                - Swagger UI는 multipart/form-data에서 List<String> 형태의 tags 필드 처리에 제한이 있습니다.
                
                ## 테스트 방법
                ### Postman 사용 시:
                - Content-Type: multipart/form-data
                - **tags 필드는 `tags[]` 형태로 전송해야 합니다.**
                - 예시: `tags[]: 웹개발`, `tags[]: 백엔드`
                
                ### 프론트엔드 연동 시:
                - FormData 객체 사용
                - tags 필드는 `tags` 또는 `tags[]` 모두 사용 가능
                - JavaScript 예시:
                ```javascript
                const formData = new FormData();
                formData.append('title', '제목');
                formData.append('content', '내용');
                formData.append('tags', '웹개발');
                formData.append('tags', '백엔드');
                formData.append('images', file1);
                formData.append('images', file2);
                ```
                """,
            security = {@SecurityRequirement(name = "bearer-key")}
    )
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostResponseDto> createPost(
            @AuthenticationPrincipal CustomUserDetails user,
            @ModelAttribute PostWithImagesRequestDto requestDto) {

        Long memberId = user.getMember().getMemberId();
        log.info("[게시글 작성 요청] memberId={}", memberId);

        PostResponseDto responseDto = postService.createPost(memberId, requestDto);
        return ResponseEntity
                .created(URI.create("/api/v2/posts/" + responseDto.getPostId()))
                .body(responseDto);
    }

    @Operation(
            summary = "게시글 수정 요청 (이미지 포함)",
            security = {@SecurityRequirement(name = "bearer-key")}
    )
    @PatchMapping(path = "/{postId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostResponseDto> updatePost(@AuthenticationPrincipal CustomUserDetails user,
                                                      @PathVariable Long postId,
                                                      @ModelAttribute PostWithImagesRequestDto requestDto) {
        Long memberId = user.getMember().getMemberId();
        log.info("[게시글 수정 요청] postId={}, memberId={}", postId, memberId);
        PostResponseDto responseDto = postService.updatePost(postId, memberId, requestDto);
        return ResponseEntity.ok(responseDto);
    }
}
