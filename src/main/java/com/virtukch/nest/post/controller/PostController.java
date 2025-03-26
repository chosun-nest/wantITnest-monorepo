package com.virtukch.nest.post.controller;

import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.post.dto.PostCreateRequestDto;
import com.virtukch.nest.post.dto.PostCreateResponseDto;
import com.virtukch.nest.post.service.PostService;
import com.virtukch.nest.tag.service.TagService;
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

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/posts")
@Tag(name = "게시글 API", description = "게시글 생성, 조회, 수정, 삭제 등 게시판 관련 API")
public class PostController {

    private final PostService postService;
    private final TagService tagService;

    @GetMapping("/new")
    @PreAuthorize("isAuthenticated()")
    @Operation(
            summary = "글 작성 접근 가능 여부 확인",
            description = "현재 로그인된 사용자가 글을 작성할 수 있는지 확인합니다. 로그인되어 있다면 200 OK를 반환합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "로그인됨 - 글 작성 가능"),
            @ApiResponse(responseCode = "403", description = "로그인되지 않음 또는 권한 없음")
    })
    public ResponseEntity<Void> checkPostWriteAccess() {
        return ResponseEntity.ok().build();
    }


    @Operation(
            summary = "게시글 작성",
            description = "인증된 사용자가 새로운 게시글을 작성합니다.",
            security = {@SecurityRequirement(name = "bearer-key")}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "게시글 생성 성공"),
            @ApiResponse(responseCode = "400", description = "요청 데이터가 유효하지 않음"),
            @ApiResponse(responseCode = "403", description = "로그인되지 않음 또는 권한 없음"),
            @ApiResponse(responseCode = "404", description = "사용자 정보 없음")
    })
    @PostMapping("/new")
    // 🔐 이 API는 CSRF 설정에 따라 POST 요청이 차단될 수 있으므로,
    // Spring Security 설정(SecurityConfig.java)에서 CSRF를 비활성화하거나, 해당 엔드포인트를 예외로 등록해야 합니다.
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PostCreateResponseDto> savePost(@AuthenticationPrincipal CustomUserDetails user,
                                                          @RequestBody PostCreateRequestDto postCreateRequestDto) {

        log.info("{}", user);

        Long postId = postService.savePost(user.getMember().getMemberId(), postCreateRequestDto);

        PostCreateResponseDto postCreateResponseDto = PostCreateResponseDto.builder()
                .id(postId)
                .message("게시글이 성공적으로 등록되었습니다.")
                .build();

        return ResponseEntity.created(URI.create("/api/posts/" + postId)).body(postCreateResponseDto);
    }
}
