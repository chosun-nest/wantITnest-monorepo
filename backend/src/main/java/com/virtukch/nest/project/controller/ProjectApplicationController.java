package com.virtukch.nest.project.controller;


import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.common.dto.ApiResponseDto;
import com.virtukch.nest.project.dto.request.ApplicationCreateRequestDto;
import com.virtukch.nest.project.dto.request.ApplicationReviewRequestDto;
import com.virtukch.nest.project.dto.request.ApplicationUpdateRequestDto;
import com.virtukch.nest.project.dto.response.ApplicationListDto;
import com.virtukch.nest.project.dto.response.MyApplicationResponseDto;
import com.virtukch.nest.project.service.ProjectApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "[프로젝트 지원 관리] 지원 처리 API", description = "프로젝트 모집글에 지원하고, 지원 현황(지원자 목록 등)을 조회할 수 있는 API입니다.")
public class ProjectApplicationController {

    private final ProjectApplicationService projectApplicationService;

    //======내 지원서 관리======
    @Operation(
        summary = "내 지원서 목록 조회",
        description = """
            로그인된 사용자가 지원한 모든 지원서 목록을 조회합니다.
            ✔️ 프로젝트 제목, 역할, 상태 등 포함
            ✔️ 지원 날짜 순으로 정렬 (최신순)
            """,
        security = {@SecurityRequirement(name = "bearer-key")}
    )
    @GetMapping("/api/v1/applications/my")
    public ResponseEntity<ApiResponseDto<List<MyApplicationResponseDto>>> getMyApplications(
            @AuthenticationPrincipal CustomUserDetails user) {
        Long memberId = user.getMember().getMemberId();
        List<MyApplicationResponseDto> applications = projectApplicationService.getMyApplications(memberId);
        return ResponseEntity.ok(ApiResponseDto.success(applications));
    }

    @Operation(
        summary = "지원서 수정",
        description = """
            대기 중인 지원서를 수정합니다.
            ✔️ 본인의 지원서만 수정 가능
            ✔️ PENDING 상태일 때만 수정 가능
            ✔️ 지원 메시지, 투입 가능 일자, 시간 등 수정
            """,
        security = {@SecurityRequirement(name = "bearer-key")}
    )
    @PutMapping("/api/v1/applications/{applicationId}")
    public ResponseEntity<ApiResponseDto<MyApplicationResponseDto>> updateApplication(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long applicationId,
            @RequestBody ApplicationUpdateRequestDto requestDto) {
        Long memberId = user.getMember().getMemberId();
        MyApplicationResponseDto updatedApplication = projectApplicationService.updateApplication(applicationId, memberId, requestDto);
        return ResponseEntity.ok(ApiResponseDto.success(updatedApplication));
    }

    @Operation(
        summary = "지원서 취소",
        description = """
            대기 중인 지원서를 취소합니다.
            ✔️ 본인의 지원서만 취소 가능
            ✔️ PENDING 상태일 때만 취소 가능
            ✔️ 취소 후 상태가 CANCELED로 변경
            """,
        security = {@SecurityRequirement(name = "bearer-key")}
    )
    @DeleteMapping("/api/v1/applications/{applicationId}")
    public ResponseEntity<ApiResponseDto<Void>> cancelApplication(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long applicationId) {
        Long memberId = user.getMember().getMemberId();
        projectApplicationService.cancelApplication(applicationId, memberId);
        return ResponseEntity.ok(ApiResponseDto.success("지원서가 성공적으로 취소되었습니다."));
    }

    //======프로젝트별 지원======
    @Operation(
        summary = "프로젝트에 지원",
        description = """
            로그인된 사용자가 해당 프로젝트에 지원합니다.
            ✔️ 같은 프로젝트에 중복 지원 불가
            ✔️ 지원 시 역할 및 자기소개 등 정보 포함
            """,
        security = {@SecurityRequirement(name = "bearer-key")}
    )
    @PostMapping("/api/v1/projects/{projectId}/applications")
    public ResponseEntity<ApiResponseDto<Void>> projectApplicationApply(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long projectId,
            @RequestBody ApplicationCreateRequestDto requestDto) {
        Long memberId = user.getMember().getMemberId();
        projectApplicationService.applyToProject(projectId, memberId, requestDto);
        return ResponseEntity.ok(ApiResponseDto.created());
    }

    //======지원서 검토 (프로젝트 팀장)======
    @Operation(
        summary = "프로젝트 지원자 목록 조회",
        description = """
            특정 프로젝트에 지원한 모든 지원자의 목록을 조회합니다.
            ✔️ 프로젝트 작성자만 조회 가능
            ✔️ 지원자 이름, 역할, 상태 등 포함
            ✔️ 지원 날짜 순으로 정렬 (최신순)
            """,
        security = {@SecurityRequirement(name = "bearer-key")}
    )
    @GetMapping("/api/v1/projects/{projectId}/applications")
    public ResponseEntity<ApiResponseDto<List<ApplicationListDto>>> getProjectApplications(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long projectId) {
        Long memberId = user.getMember().getMemberId();
        List<ApplicationListDto> applications = projectApplicationService.getApplicationsByProject(projectId, memberId);
        return ResponseEntity.ok(ApiResponseDto.success(applications));
    }

    @Operation(
        summary = "지원서 승인/거절 처리",
        description = """
            특정 지원서를 승인하거나 거절합니다.
            ✔️ 프로젝트 작성자만 처리 가능
            ✔️ PENDING 상태의 지원서만 처리 가능
            ✔️ 승인 시 프로젝트 및 역할 정원 확인
            ✔️ 검토 의견 추가 가능
            """,
        security = {@SecurityRequirement(name = "bearer-key")}
    )
    @PatchMapping("/api/v1/applications/{applicationId}/review")
    public ResponseEntity<ApiResponseDto<Void>> reviewApplication(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long applicationId,
            @RequestBody ApplicationReviewRequestDto requestDto) {
        Long memberId = user.getMember().getMemberId();
        projectApplicationService.reviewApplication(applicationId, memberId, requestDto);
        return ResponseEntity.ok(ApiResponseDto.success("지원서 검토가 성공적으로 완료되었습니다."));
    }

}
