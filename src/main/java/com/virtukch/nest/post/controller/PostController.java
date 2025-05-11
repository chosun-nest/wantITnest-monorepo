package com.virtukch.nest.post.controller;

import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.post.dto.PostDetailResponseDto;
import com.virtukch.nest.post.dto.PostListResponseDto;
import com.virtukch.nest.post.dto.PostRequestDto;
import com.virtukch.nest.post.dto.PostResponseDto;
import com.virtukch.nest.post.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/posts")
@Tag(name = "[관심분야 정보 게시판] 게시글 API", description = "게시글 생성, 조회, 수정, 삭제 등 게시판 관련 API")
public class PostController {

    private final PostService postService;

    @Operation(
            summary = "게시글 작성",
            description = """
                    - `title`: 빈 문자열 또는 null 값 불가
                    - `content`: 빈 문자열은 허용 (null 값은 빈 문자열로 간주)
                    - `tags`: 태그 목록에 존재하는 태그만 설정 가능
                    """,
            security = {@SecurityRequirement(name = "bearer-key")}
    )
    @PostMapping
    public ResponseEntity<PostResponseDto> createPost(@AuthenticationPrincipal CustomUserDetails user,
                                                      @Valid @RequestBody PostRequestDto requestDto) {
        Long memberId = user.getMember().getMemberId();
        log.info("[게시글 작성 요청] memberId={}", memberId);
        PostResponseDto responseDto = postService.createPost(memberId, requestDto);
        return ResponseEntity
                .created(URI.create("/api/v1/posts/" + responseDto.getPostId()))
                .body(responseDto);
    }

    @Operation(
            summary = "게시글 상세 조회",
            description = "게시글 ID를 기반으로 상세 조회",
            security = {@SecurityRequirement(name = "bearer-key")}
    )
    @GetMapping("/{postId}")
    public ResponseEntity<PostDetailResponseDto> getPostDetail(@PathVariable Long postId) {
        PostDetailResponseDto responseDto = postService.getPostDetail(postId);
        return ResponseEntity.ok(responseDto);
    }

    @Operation(
            summary = "게시글 목록 조회",
            description = """
                    게시글 목록을 조회합니다. (이 기능은 Postman을 이용하여 테스트하는 것을 추천)
                    
                    ## 태그 필터링
                    - 태그 필터링을 하지 않으면 전체 게시글을 반환합니다.
                    - 태그를 필터링하려면 `?tags=JAVA&tags=SPRING`과 같이 쿼리 파라미터로 전달하세요.
                    
                    ## 페이지네이션
                    - 페이지 번호: `?page=0` (기본값: 0, 첫 페이지)
                    - 페이지 크기: `?size=10` (기본값: 10, 페이지당 10개 항목)
                    - 전체 예시: `?page=0&size=10`
                    
                    ## 정렬
                    - 단일 필드 정렬: `?sort=createdAt,desc` (기본값: createdAt,desc)
                    - 다중 필드 정렬: `?sort=viewCount,desc&sort=createdAt,desc`
                    - 사용 가능한 정렬 필드: createdAt, viewCount, title
                    
                    ## 전체 사용 예시
                    - `/api/v1/posts?page=0&size=10&sort=createdAt,desc&tags=JAVA&tags=SPRING`
                    """
    )
    @GetMapping
    public ResponseEntity<PostListResponseDto> getPostList(
            @RequestParam(required = false) List<String> tags,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        PostListResponseDto responseDto;
        if (tags == null || tags.isEmpty()) {
            responseDto = postService.getPostList(pageable);
        } else {
            responseDto = postService.getPostList(tags, pageable);
        }

        return ResponseEntity.ok(responseDto);
    }

    @Operation(
            summary = "게시글 수정 요청",
            description = """
                    PATCH 요청 시, 각 JSON 필드의 처리 방식은 다음과 같습니다:
                    
                    📌 title
                    - "title": null 또는 생략 → 수정하지 않음
                    - "title": "" (빈 문자열) → 수정하지 않음 ***특히 주의***
                    - "title": "새 제목" → 제목 수정
                    
                    📌 content
                    - "content": null 또는 생략 → 수정하지 않음
                    - "content": "" → 본문 내용을 전부 삭제
                    - "content": "새 내용" → 본문 수정
                    
                    📌 tags
                    - "tags": null 또는 생략 → 수정하지 않음
                    - "tags": [] → 태그 전부 제거
                    - "tags": ["Java", "Spring"] → 태그 재설정
                    """,
            security = {@SecurityRequirement(name = "bearer-key")}
    )
    @PatchMapping("/{postId}")
    public ResponseEntity<PostResponseDto> updatePost(@AuthenticationPrincipal CustomUserDetails user,
                                                      @PathVariable Long postId,
                                                      @Valid @RequestBody PostRequestDto requestDto) {
        Long memberId = user.getMember().getMemberId();
        log.info("[게시글 수정 요청] postId={}, memberId={}", postId, memberId);
        PostResponseDto responseDto = postService.updatePost(postId, memberId, requestDto);
        return ResponseEntity.ok(responseDto);
    }

    @Operation(
            summary = "게시글 삭제",
            description = """
                    회원 ID를 기반으로 게시글 삭제
                    - 작성자와 삭제하려는 사용자의 memberId가 다를 경우 **NoPostAuthorityException**
                    """,
            security = {@SecurityRequirement(name = "bearer-key")}
    )
    @DeleteMapping("/{postId}")
    public ResponseEntity<PostResponseDto> deletePost(@AuthenticationPrincipal CustomUserDetails user,
                                                      @PathVariable Long postId) {
        Long memberId = user.getMember().getMemberId();
        log.info("[게시글 삭제 요청] postId={}, memberId={}", postId, memberId);
        PostResponseDto responseDto = postService.deletePost(memberId, postId);
        return ResponseEntity.ok(responseDto);
    }
}