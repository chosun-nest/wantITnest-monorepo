package com.virtukch.nest.project.controller;

import com.virtukch.nest.project.dto.ProjectRequestDTO;
import com.virtukch.nest.project.dto.ProjectResponseDTO;
import com.virtukch.nest.project.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    // 프로젝트 생성
    @PostMapping
    public ResponseEntity<Long> createProject(@RequestBody ProjectRequestDTO dto) {
        Long projectId = projectService.createProject(dto);
        return ResponseEntity.ok(projectId);
    }

    // 전체 프로젝트 조회
    @GetMapping
    public ResponseEntity<List<ProjectResponseDTO>> getProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    // 프로젝트 모집 마감
    @PatchMapping("/{id}/close")
    public ResponseEntity<Void> closeRecruitment(@PathVariable Long id) {
        projectService.closeProjectRecruitment(id);
        return ResponseEntity.ok().build();
    }
}
