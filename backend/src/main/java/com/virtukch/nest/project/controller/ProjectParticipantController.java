package com.virtukch.nest.project.controller;

import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.common.dto.ApiResponseDto;
import com.virtukch.nest.project.dto.response.ParticipantResponseDto;
import com.virtukch.nest.project.service.ProjectParticipantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "[프로젝트 모집 게시판] 참여자 관리 API", description = "프로젝트 참여자 조회 및 관리 API")
public class ProjectParticipantController {

    private final ProjectParticipantService participantService;

    @Operation(
            summary = "프로젝트 참여자 목록 조회",
            description = """
                    프로젝트 ID를 기반으로 해당 프로젝트에 참여 중인 모든 참여자 목록을 조회합니다.
                    
                    ## 📋 포함 정보
                    - **참여자 기본 정보**: ID, 이름, 이메일
                    - **역할 정보**: 역할명, 포지션(LEADER/MEMBER)
                    - **참여 상태**: ACTIVE(활성)/LEFT(탈퇴) 및 참여 일시
                    
                    ## 👥 참여자 포지션
                    - **LEADER**: 프로젝트 리더 (생성자 또는 권한 이양받은 자)
                    - **MEMBER**: 일반 참여자
                    
                    ## 📊 참여 상태
                    - **ACTIVE**: 현재 활동 중인 참여자
                    - **LEFT**: 프로젝트에서 탈퇴한 참여자
                    
                    ## 🔍 조회 권한
                    - 모든 사용자가 조회 가능 (공개 정보)
                    - 참여자의 기본적인 프로필 정보만 노출
                    """
    )
    @GetMapping("/{projectId}/participants")
    public ResponseEntity<ApiResponseDto<List<ParticipantResponseDto>>> getProjectParticipants(@PathVariable Long projectId) {
        List<ParticipantResponseDto> participants = participantService.getProjectParticipants(projectId);
        return ResponseEntity.ok(ApiResponseDto.success("프로젝트 참여자 목록을 성공적으로 조회했습니다.", participants));
    }

    @Operation(
            summary = "팀원 제거",
            description = """
                    프로젝트에서 특정 팀원을 제거합니다.
                    
                    ## 🔐 제거 권한
                    다음 두 가지 경우에만 팀원 제거가 가능합니다:
                    
                    ### 1️⃣ 본인 탈퇴 (Self Leave)
                    - 자신이 참여 중인 프로젝트에서 직접 탈퇴
                    - 언제든지 자유롭게 탈퇴 가능
                    
                    ### 2️⃣ 팀장 제거 (Leader Remove)
                    - 프로젝트 생성자(팀장)가 다른 팀원을 제거
                    - 팀 관리 및 프로젝트 운영을 위한 권한
                    
                    ## ⚡ 처리 방식
                    - **소프트 삭제**: 참여자 상태를 'LEFT'로 변경
                    - **히스토리 보존**: 탈퇴 시간(leftAt) 기록 및 데이터 보존
                    - **즉시 적용**: 제거 즉시 프로젝트 참여자 목록에서 제외
                    
                    ## 🚫 제거 불가 조건
                    - 권한이 없는 사용자가 다른 팀원을 제거하려는 경우
                    - 이미 탈퇴한 참여자를 다시 제거하려는 경우
                    - 존재하지 않는 참여자를 제거하려는 경우
                    
                    ## 📤 응답
                    - 성공시: 제거 완료 메시지
                    - 실패시: 구체적인 오류 사유와 해결 방법 안내
                    """,
            security = {@SecurityRequirement(name = "bearer-key")}
    )
    @DeleteMapping("/{projectId}/participants/{memberId}")
    public ResponseEntity<ApiResponseDto<Void>> removeTeamMember(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long projectId,
            @PathVariable Long memberId) {
        
        Long requesterId = user.getMember().getMemberId();
        participantService.removeTeamMember(projectId, memberId, requesterId);
        return ResponseEntity.ok(ApiResponseDto.success("팀원이 성공적으로 제거되었습니다."));
    }
}