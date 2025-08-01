package com.virtukch.nest.project.controller;

import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.common.dto.ApiResponseDto;
import com.virtukch.nest.project.dto.request.ProjectStatusUpdateRequestDto;
import com.virtukch.nest.project.model.enums.ProjectStatus;
import com.virtukch.nest.project.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "[프로젝트 모집 게시판] 프로젝트 관리 API", description = "프로젝트 상태 관리 및 운영 API")
public class ProjectManagementController {

    private final ProjectService projectService;

    @Operation(
            summary = "프로젝트 상태 변경",
            description = """
                    프로젝트의 진행 상태를 변경합니다.
                    
                    ## 🔄 프로젝트 상태 흐름
                    
                    ### 📋 상태 종류
                    - **RECRUITING**: 팀원 모집 중
                    - **CLOSED**: 모집 마감 (팀 구성 완료)
                    - **IN_PROGRESS**: 프로젝트 진행 중
                    - **COMPLETED**: 프로젝트 완료
                    - **DELETED**: 삭제됨 (비활성화)
                    
                    ### ➡️ 허용되는 상태 전환
                    
                    **RECRUITING (모집 중) →**
                    - `CLOSED`: 모집 마감 (충분한 인원 확보)
                    - `DELETED`: 프로젝트 취소
                    
                    **CLOSED (모집 마감) →**
                    - `IN_PROGRESS`: 프로젝트 시작
                    - `RECRUITING`: 추가 모집 재개
                    - `DELETED`: 프로젝트 취소
                    
                    **IN_PROGRESS (진행 중) →**
                    - `COMPLETED`: 프로젝트 완료
                    - `RECRUITING`: 추가 인원 모집 (드문 경우)
                    - `DELETED`: 프로젝트 중단
                    
                    **COMPLETED (완료) →**
                    - `DELETED`: 아카이브 또는 삭제
                    
                    **DELETED (삭제됨) →**
                    - ❌ 다른 상태로 전환 불가
                    
                    ## 🔐 권한 요구사항
                    - **프로젝트 생성자(팀장)만** 상태 변경 가능
                    - 다른 팀원이나 외부 사용자는 변경 불가
                    
                    ## ✅ 상태 변경 시 고려사항
                    - **멱등성 보장**: 동일한 상태로의 변경은 오류 없이 처리
                    - **비즈니스 로직 검증**: 논리적으로 불가능한 전환은 차단
                    - **자동 알림**: 상태 변경시 팀원들에게 알림 발송 (향후 구현)
                    
                    ## 📤 응답 정보
                    - 이전 상태와 새로운 상태 정보
                    - 상태 변경 완료 메시지
                    """,
            security = {@SecurityRequirement(name = "bearer-key")}
    )
    @PatchMapping("/{projectId}/status")
    public ResponseEntity<ApiResponseDto<Void>> updateProjectStatus(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long projectId,
            @RequestBody ProjectStatusUpdateRequestDto requestDto
    ) {
        Long memberId = user.getMember().getMemberId();
        
        // 상태 변경 전 현재 상태 조회
        ProjectStatus prevStatus = projectService.findByIdOrThrow(projectId).getStatus();
        
        // 상태 변경 실행
        projectService.updateProjectStatus(projectId, memberId, requestDto);
        
        // 변경 후 새로운 상태
        ProjectStatus newStatus = requestDto.getStatus();
        
        String message = String.format("프로젝트 상태를 '%s'에서 '%s'로 변경했습니다.", 
                getStatusDisplayName(prevStatus), 
                getStatusDisplayName(newStatus));

        return ResponseEntity.ok(ApiResponseDto.success(message));
    }
    
    /**
     * 상태를 사용자 친화적인 이름으로 변환
     */
    private String getStatusDisplayName(ProjectStatus status) {
        return switch (status) {
            case RECRUITING -> "모집 중";
            case CLOSED -> "모집 마감";
            case IN_PROGRESS -> "진행 중";
            case COMPLETED -> "완료";
            case DELETED -> "삭제됨";
        };
    }
}