package com.virtukch.nest.post.controller;

import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.post.dto.*;
import com.virtukch.nest.post.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/posts")
@Tag(name = "게시글 API", description = "게시글 생성, 조회, 수정, 삭제 등 게시판 관련 API")
public class PostController {

    private final PostService postService;

    @Operation(
            summary = "게시글 작성",
            security = {@SecurityRequirement(name = "bearer-key")}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "게시글 생성 성공")
    })
    @PostMapping("/new")
    public ResponseEntity<PostCreateResponseDto> createPost(@AuthenticationPrincipal CustomUserDetails user,
                                                            @RequestBody PostCreateRequestDto requestDto) {

        Long memberId = user.getMember().getMemberId();
        log.info("[게시글 작성 요청] memberId={}", memberId);
        PostCreateResponseDto responseDto = postService.createPost(memberId, requestDto);
        return ResponseEntity
                .created(URI.create("/api/posts/" + responseDto.getPostId()))
                .body(responseDto);
    }

    @Operation(
            summary = "게시글 상세 조회",
            description = "게시글 ID를 기반으로 상세 조회",
            security = {@SecurityRequirement(name = "bearer-key")}
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "404", description = "게시글 없음")
    })
    @GetMapping("/{postId}")
    public ResponseEntity<PostDetailResponseDto> getPostDetail(@PathVariable Long postId) {
        PostDetailResponseDto responseDto = postService.getPostDetail(postId);
        return ResponseEntity.ok(responseDto);
    }

    @Operation(
            summary = "게시글 목록 조회",
            description = "RequestParam으로 태그를 포함할 경우, 해당 태그에 속한 게시글들을 반환. 태그를 포함하지 않을 경우에는, 전체 게시글 반환"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
    })
    @GetMapping
    public ResponseEntity<PostListResponseDto> getPostList(@RequestParam(required = false) List<String> tags) {
        PostListResponseDto responseDto;
        if (tags == null || tags.isEmpty()) responseDto = postService.getPostList();
        else responseDto = postService.getPostList(tags);

        return ResponseEntity.ok(responseDto);
    }

    @Operation(
            summary = "게시글 목록 조회",
            description = """
                    게시글 목록을 조회합니다.
                    - 태그 필터링을 하지 않으면 전체 게시글을 반환합니다.
                    - 태그를 필터링하려면 ?tags=JAVA&tags=SPRING 와 같이 쿼리 파라미터로 전달하세요.
                    """
    )
    @ApiResponses({@ApiResponse(responseCode = "200", description = "조회 성공")})
    @PatchMapping("/update/{postId}")
    public ResponseEntity<PostUpdateResponseDto> updatePost(@AuthenticationPrincipal CustomUserDetails user,
                                                            @PathVariable Long postId,
                                                            @RequestBody PostUpdateRequestDto requestDto) {
        Long memberId = user.getMember().getMemberId();
        log.info("[게시글 수정 요청] postId={}, memberId={}", postId, memberId);
        PostUpdateResponseDto responseDto = postService.updatePost(postId, memberId, requestDto);
        return ResponseEntity.ok(responseDto);
    }
}