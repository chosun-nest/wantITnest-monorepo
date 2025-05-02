package com.virtukch.nest.project.controller;

import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.project.dto.ProjectRequestDTO;
import com.virtukch.nest.project.dto.ProjectResponseDTO;
import com.virtukch.nest.project.dto.ProjectUpdateRequestDTO;
import com.virtukch.nest.project.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    // 프로젝트 생성
    @PostMapping("/new")
    public ResponseEntity<Long> createProject(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody ProjectRequestDTO dto) {
        Long projectId = projectService.createProject(dto, user.getMember().getMemberId());
        return ResponseEntity.ok(projectId);
    }

    // 전체 프로젝트 조회
    @GetMapping
    public ResponseEntity<List<ProjectResponseDTO>> getProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    //프로젝트 업데이트
    @PutMapping("/api/projects/{projectId}")
    public ResponseEntity<Void> updateProject(
            @PathVariable Long projectId,
            @RequestBody ProjectUpdateRequestDTO dto,
            @AuthenticationPrincipal CustomUserDetails userDetails) throws AccessDeniedException {

        Long memberId = userDetails.getMember().getMemberId();
        projectService.updateProject(projectId, memberId, dto);
        return ResponseEntity.ok().build();
    }

    // 프로젝트 모집 마감
    @PatchMapping("/{id}/close")
    public ResponseEntity<Void> closeRecruitment(@PathVariable Long id) {
        projectService.closeProjectRecruitment(id);
        return ResponseEntity.ok().build();
    }
}
