package com.virtukch.nest.project_application.controller;

import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.project_application.dto.ProjectApplicationRequestDto;
import com.virtukch.nest.project_application.dto.ProjectApplicationResponseDto;
import com.virtukch.nest.project_application.service.ProjectApplicationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/projects")
@Tag(name = "[프로젝트 모집글 지원 관리] 지원 처리 API", description = "프로젝트 모집글에 지원하고, 지원 현황(지원자 목록 등)을 조회할 수 있는 API입니다.\n문의 : dlwlgur02@gmail.com")
public class ProjectApplicationController {
    private final ProjectApplicationService projectApplicationService;

    @Operation(
        summary = "프로젝트 모집글에 지원",
        description = """
            로그인된 사용자가 해당 프로젝트 모집글에 지원합니다.
            ✔️ 같은 프로젝트에 중복 지원 불가
            ✔️ 지원 시 역할 및 자기소개 등 정보 포함
            """,
        security = {@SecurityRequirement(name = "bearer-key")}
    )
    @PostMapping("/{projectId}/apply")
    public ResponseEntity<ProjectApplicationResponseDto> projectApplicationApply(@AuthenticationPrincipal CustomUserDetails user,
                                      @PathVariable Long projectId,
                                      @RequestBody ProjectApplicationRequestDto requestDto) {
        Long memberId = user.getMember().getMemberId();
        ProjectApplicationResponseDto responseDto = projectApplicationService.applyToProject(projectId, memberId, requestDto);
        return ResponseEntity.ok(responseDto);
    }

    @Operation(
        summary = "프로젝트 모집글 지원자 목록 조회",
        description = """
            특정 프로젝트에 지원한 모든 지원자의 목록을 조회합니다.
            ✔️ 작성자 본인만 조회 가능
            ✔️ 지원자 이름, 역할, 상태 등 포함
            """,
        security = {@SecurityRequirement(name = "bearer-key")}
    )
    @GetMapping("/{projectId}/applications")
    public ResponseEntity<List<ProjectApplicationResponseDto>> getProjectApplications(@AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long projectId) {
        List<ProjectApplicationResponseDto> applications = projectApplicationService.getApplicationsByProject(projectId);
        return ResponseEntity.ok(applications);
    }


    @Operation(
        summary = "프로젝트 지원 수락",
        description = """
            프로젝트 작성자가 특정 지원자의 지원을 수락합니다.
            ✔️ 수락 시 프로젝트 멤버로 등록
            ✔️ 모집 인원 초과 시 수락 불가
            """,
        security = {@SecurityRequirement(name = "bearer-key")}
    )
    @PostMapping("/{projectId}/applications/{applicationId}/accept")
    public ResponseEntity<ProjectApplicationResponseDto> acceptApplication(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long projectId,
            @PathVariable Long applicationId) {
        Long memberId = user.getMember().getMemberId();
        ProjectApplicationResponseDto responseDto = projectApplicationService.acceptApplication(projectId, applicationId, memberId);
        return ResponseEntity.ok(responseDto);
    }

    @Operation(
        summary = "프로젝트 지원 거절",
        description = """
            프로젝트 작성자가 특정 지원자의 지원을 거절합니다.
            ✔️ 지원 상태를 'REJECTED'로 변경
            """,
        security = {@SecurityRequirement(name = "bearer-key")}
    )
    @PostMapping("/{projectId}/applications/{applicationId}/reject")
    public ResponseEntity<ProjectApplicationResponseDto> rejectApplication(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long projectId,
            @PathVariable Long applicationId) {
        Long memberId = user.getMember().getMemberId();
        ProjectApplicationResponseDto responseDto = projectApplicationService.rejectApplication(projectId, applicationId, memberId);
        return ResponseEntity.ok(responseDto);
    }

}
