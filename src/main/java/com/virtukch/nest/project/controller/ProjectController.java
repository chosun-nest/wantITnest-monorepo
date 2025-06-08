package com.virtukch.nest.project.controller;

import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.post.service.PostService;
import com.virtukch.nest.project.dto.*;
import com.virtukch.nest.project.service.ProjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Slf4j
public class ProjectController {

    private final ProjectService projectService;
    private final PostService postService;

    // 프로젝트 생성
    @PostMapping("/new")
    public ResponseEntity<ProjectResponseDto> createProject(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody ProjectRequestDto requestDTO) {
        Long memberId = user.getMember().getMemberId();
        log.info("[모집글 작성 요청] memberId={}", memberId);
        ProjectResponseDto responseDto = projectService.createProject(memberId, requestDTO);
        return ResponseEntity
                .created(URI.create("/api/projects/" + responseDto.getProjectId()))
                .body(responseDto);
    }

    // 전체 프로젝트 조회
    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectDetailResponseDto> getProjectDetail(@PathVariable Long projectId) {
        ProjectDetailResponseDto responseDto = projectService.getProjectDetail(projectId);
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping
    public ResponseEntity<ProjectListResponseDto> getProjects(
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


    //프로젝트 업데이트
    @PatchMapping("/{projectId}")
    public ResponseEntity<ProjectResponseDto> updateProject(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long projectId,
            @Valid @RequestBody ProjectRequestDto requestDto) {
        Long memberId = user.getMember().getMemberId();
        log.info("[모집글 수정 요청] projectId={}, memberId={}", projectId, memberId);
        ProjectResponseDto responseDto = projectService.updateProject(projectId, memberId, requestDto);
        return ResponseEntity.ok(responseDto);
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<ProjectResponseDto> deleteProject(@AuthenticationPrincipal CustomUserDetails user,
                                                            @PathVariable Long projectId) {
        Long memberId = user.getMember().getMemberId();
        log.info("[모집글 삭제 요청] projectId={}, memberId={}", projectId, memberId);
        ProjectResponseDto responseDto = projectService.deleteProject(projectId, memberId);
        return ResponseEntity.ok(responseDto);
    }


    @GetMapping("/search")
    public ResponseEntity<ProjectListResponseDto> searchProjects(
            @RequestParam String keyword,
            @RequestParam(required = false, defaultValue = "ALL") String searchType,
            @RequestParam(required = false) List<String> tags,
            @PageableDefault(size = 10, sort = "createAt", direction = Sort.Direction.DESC) Pageable pageable) {

        ProjectListResponseDto responseDto;
        if(tags == null || tags.isEmpty()) {
            responseDto = projectService.searchProjects(keyword, searchType, pageable);
        } else {
            responseDto = projectService.searchProjectsWithTags(keyword, tags, searchType, pageable);
        }

        return ResponseEntity.ok(responseDto);
    }

}
