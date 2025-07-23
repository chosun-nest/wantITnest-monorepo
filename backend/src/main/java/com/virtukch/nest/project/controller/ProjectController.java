package com.virtukch.nest.project.controller;

import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.project.dto.ProjectDetailResponseDto;
import com.virtukch.nest.project.dto.response.ProjectCreateResponseDto;
import com.virtukch.nest.project.dto.response.ProjectListResponseDto;
import com.virtukch.nest.project.dto.request.ProjectCreateRequestDto;
import com.virtukch.nest.project.dto.ProjectResponseDto;
import com.virtukch.nest.project.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.Getter;
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
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "[프로젝트 모집 게시판] 게시글 API", description = "프로젝트 CRUD API")
public class ProjectController {

    private final ProjectService projectService;

    // 프로젝트 생성
    @Operation(
        summary = "새 프로젝트 등록",
        description = """
            새로운 프로젝트 모집글을 생성합니다.

            ## 요청 필드

            ✔️ 로그인된 사용자만 작성 가능
            ✔️ 성공 시 생성된 게시글의 URI를 Location 헤더로 반환
            """,
        security = {@SecurityRequirement(name = "bearer-key")}
    )
    @PostMapping
    public ResponseEntity<ProjectCreateResponseDto> createProject(@AuthenticationPrincipal CustomUserDetails user,
                                                                  @RequestBody ProjectCreateRequestDto requestDto) {
        Long memberId = user.getMember().getMemberId();
        ProjectCreateResponseDto responseDto = projectService.createProject(memberId, requestDto);
        return ResponseEntity
                .created(URI.create("/api/v1/projects/" + responseDto.getProjectId()))
                .body(responseDto);
    }

    @GetMapping
    public ResponseEntity<ProjectListResponseDto> getProjectList(
            @RequestParam(required = false) List<String> tags,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        ProjectListResponseDto responseDto = projectService.getProjectList(pageable);
        return ResponseEntity.ok(responseDto);
    }
}
