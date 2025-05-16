package com.virtukch.nest.project.controller;

import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.post.service.PostService;
import com.virtukch.nest.project.dto.ProjectCreateRequestDto;
import com.virtukch.nest.project.dto.ProjectCreateResponseDto;
import com.virtukch.nest.project.dto.ProjectUpdateRequestDto;
import com.virtukch.nest.project.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final PostService postService;

    // 프로젝트 생성
    @PostMapping("/new")
    public ResponseEntity<ProjectCreateResponseDto> createProject(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody ProjectCreateRequestDto requestDTO) {
        ProjectCreateResponseDto responseDto = projectService.createProject(user.getMember(), requestDTO);
        return ResponseEntity
                .created(URI.create("/api/projects/" + responseDto.getProjectId()))
                .body(responseDto);
    }

    // 전체 프로젝트 조회
    @GetMapping
    public ResponseEntity<List<ProjectCreateResponseDto>> getProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    //프로젝트 업데이트
    @PutMapping("/update/{projectId}")
    public ResponseEntity<Void> updateProject(
            @PathVariable Long projectId,
            @RequestBody ProjectUpdateRequestDto dto,
            @AuthenticationPrincipal CustomUserDetails user) throws AccessDeniedException {
        projectService.updateProject(projectId, user.getMember().getMemberId(), dto);
        return ResponseEntity.ok().build();
    }

    // 프로젝트 모집 마감
    @PatchMapping("/{id}/close")
    public ResponseEntity<Void> closeRecruitment(@PathVariable Long id) {
        projectService.closeProjectRecruitment(id);
        return ResponseEntity.ok().build();
    }
}
