package com.virtukch.nest.project_application.controller;

import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.project_application.dto.ProjectApplicationRequestDto;
import com.virtukch.nest.project_application.dto.ProjectApplicationResponseDto;
import com.virtukch.nest.project_application.service.ProjectApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/projects")
public class ProjectApplicationController {
    private final ProjectApplicationService projectApplicationService;

    @PostMapping("/{projectId}/apply")
    public ResponseEntity<ProjectApplicationResponseDto> projectApplicationApply(@AuthenticationPrincipal CustomUserDetails user,
                                      @PathVariable Long projectId,
                                      @RequestBody ProjectApplicationRequestDto requestDto) {
        Long memberId = user.getMember().getMemberId();
        ProjectApplicationResponseDto responseDto = projectApplicationService.applyToProject(projectId, memberId, requestDto);
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/{projectId}/applications")
    public ResponseEntity<List<ProjectApplicationResponseDto>> getProjectApplications(@PathVariable Long projectId) {
        List<ProjectApplicationResponseDto> applications = projectApplicationService.getApplicationsByProject(projectId);
        return ResponseEntity.ok(applications);
    }
}
