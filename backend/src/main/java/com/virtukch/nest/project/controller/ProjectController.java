package com.virtukch.nest.project.controller;

import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.project.dto.request.ProjectCreateRequestDto;
import com.virtukch.nest.project.dto.request.ProjectUpdateRequestDto;
import com.virtukch.nest.project.dto.response.ProjectResponseDto;
import com.virtukch.nest.project.dto.response.ProjectListResponseDto;
import com.virtukch.nest.project.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
            summary = "프로젝트 생성",
            description = """
                    **프로젝트 생성에 필요한 정보를 받아 프로젝트를 생성합니다.**
                    - projectTitle: 모집글 제목 (필수)
                    - projectDescription: 프로젝트 설명
                    - totalMemberNeeded: 총 모집 인원
                    - recruitmentEndDate: 모집 마감일
                    - projectStartDate: 프로젝트 시작일
                    - projectEndDate: 프로젝트 종료일
                    - creatorRoleIndex: 생성자의 역할 인덱스
                    - roles: 역할 목록
                    - tags: 태그 목록

                    **응답**
                    - projectId: 생성된 프로젝트 ID
                    - projectTitle: 생성된 프로젝트 제목
                    - status: 프로젝트 상태 (기본값: RECRUITING)
                    - totalMemberNeeded: 총 모집 인원
                    - currentMembers: 현재 인원 (기본값: 글 작성자 본인 1명)
                    - recruitmentEndDate: 모집 마감일
                    - message: 응답 메시지

                    **에러**
                    - 400 Bad Request: 잘못된 요청 (예: 필수 필드 누락)
                    - 401 Unauthorized: 인증되지 않은 사용자
                    - 500 Internal Server Error: 서버 내부 오류
                    """,
            security = {@SecurityRequirement(name = "bearer-key")}
    )
    @PostMapping
    public ResponseEntity<ProjectResponseDto> createProject(@AuthenticationPrincipal CustomUserDetails user,
                                                            @RequestBody ProjectCreateRequestDto requestDto) {
        Long memberId = user.getMember().getMemberId();
        ProjectResponseDto responseDto = projectService.createProject(memberId, requestDto);
        return ResponseEntity
                .created(URI.create("/api/v1/projects/" + responseDto.getProjectId()))
                .body(responseDto);
    }

    @GetMapping
    public ResponseEntity<ProjectListResponseDto> getProjectList(
            @RequestParam(required = false) List<String> tags,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        ProjectListResponseDto responseDto;
        if(tags == null || tags.isEmpty()) {
            responseDto = projectService.getProjectList(pageable);
        } else {
            responseDto = projectService.getProjectList(tags, pageable);
        }
        return ResponseEntity.ok(responseDto);
    }

    @PatchMapping("/{projectId}")
    public ResponseEntity<ProjectResponseDto> updateProject(@AuthenticationPrincipal CustomUserDetails user,
                                                            @PathVariable Long projectId,
                                                            @RequestBody ProjectUpdateRequestDto requestDto) {
        Long memberId = user.getMember().getMemberId();
        ProjectResponseDto responseDto = projectService.updateProject(projectId, memberId, requestDto);

        return ResponseEntity.ok(responseDto);
    }
}
