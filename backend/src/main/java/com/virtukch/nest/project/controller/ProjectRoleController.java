package com.virtukch.nest.project.controller;

import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.project.dto.request.RoleCreateRequestDto;
import com.virtukch.nest.project.dto.request.RoleUpdateRequestDto;
import com.virtukch.nest.project.dto.response.RoleListDto;
import com.virtukch.nest.project.service.ProjectRoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/roles")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "[프로젝트 모집 게시판] 역할 관리 API", description = "프로젝트 내 역할(포지션) 생성, 조회, 수정, 삭제 API")
public class ProjectRoleController {

    private final ProjectRoleService roleService;

    @Operation(
            summary = "프로젝트 역할 목록 조회",
            description = """
                    특정 프로젝트의 모든 역할(포지션) 목록을 조회합니다.
                    
                    ## 📋 조회 정보
                    
                    ### 🎯 역할 기본 정보
                    - **역할 ID**: 역할의 고유 식별자
                    - **역할명**: 역할의 이름 (예: "프론트엔드 개발자", "백엔드 개발자", "디자이너")
                    - **역할 설명**: 해당 역할의 상세 업무 내용
                    - **추가 요구사항**: 특별한 기술이나 경험 요구사항
                    
                    ### 👥 모집 현황
                    - **필요 인원 수**: 해당 역할에 필요한 총 인원
                    - **현재 인원 수**: 현재 해당 역할에 배정된 인원
                    - **남은 자리**: 추가로 모집 가능한 인원 (필요 인원 - 현재 인원)
                    
                    ### 🛠️ 기술 스택 정보
                    - **요구 기술 스택**: 해당 역할에 필요한 기술들
                    - **숙련도 요구사항**: 각 기술별 요구되는 숙련도 수준
                    
                    ## 🔍 사용 사례
                    - 프로젝트 상세 페이지에서 모집 중인 역할 표시
                    - 지원하기 전 역할별 요구사항 확인
                    - 프로젝트 팀 구성 현황 파악
                    
                    ## 📊 응답 데이터
                    역할 목록과 각 역할의 상세 정보, 모집 현황을 포함한 종합적인 정보를 제공합니다.
                    """
    )
    @GetMapping
    public ResponseEntity<RoleListDto> getProjectRole(@PathVariable("projectId") Long projectId) {
        return ResponseEntity.ok(roleService.getProjectRole(projectId));
    }

    @Operation(
            summary = "프로젝트 역할 생성",
            description = """
                    기존 프로젝트에 새로운 역할(포지션)을 추가합니다.
                    
                    ## 🔐 권한 요구사항
                    - **프로젝트 생성자(팀장)만** 역할 추가 가능
                    - 다른 팀원이나 외부 사용자는 역할 생성 불가
                    
                    ## 📝 필수 입력 항목
                    
                    ### 🎯 역할 기본 정보
                    - **roleName**: 역할명 (2-50자)
                      - 예시: "프론트엔드 개발자", "UI/UX 디자이너", "백엔드 개발자"
                    - **roleDescription**: 역할 설명 (10-500자)
                      - 해당 역할의 주요 업무와 책임 상세 기술
                    - **requiredCount**: 필요 인원 수 (1명 이상)
                      - 해당 역할에 필요한 총 인원 수
                    
                    ## 🏷️ 선택 항목
                    - **additionalRequirements**: 추가 요구사항
                      - 특별한 기술, 경험, 자격 요건 등
                      - 예시: "React 3년 이상 경험", "포트폴리오 필수"
                    
                    ## ⚡ 처리 과정
                    1. 프로젝트 존재 및 권한 확인
                    2. 역할 정보 유효성 검증
                    3. 새로운 역할 생성 및 프로젝트에 연결
                    4. 총 모집 인원 수 자동 업데이트
                    
                    ## 💡 활용 사례
                    - 프로젝트 진행 중 추가 전문가 필요시
                    - 초기 기획에서 누락된 역할 보완
                    - 프로젝트 규모 확장으로 인한 인력 증원
                    
                    ## ⚠️ 주의사항
                    - 프로젝트당 최대 10개의 역할까지 생성 가능
                    - 동일한 역할명 중복 생성 불가
                    - 생성 후 즉시 해당 역할로 지원 접수 시작
                    """,
            security = {@SecurityRequirement(name = "bearer-key")}
    )
    @PostMapping
    public ResponseEntity<Void> createProjectRole(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable("projectId") Long projectId,
            @Valid @RequestBody RoleCreateRequestDto request) {
        Long memberId = user.getMember().getMemberId();
        roleService.createProjectRole(projectId, memberId, request);
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "프로젝트 역할 수정",
            description = """
                    기존 프로젝트 역할의 정보를 수정합니다.
                    
                    ## 🔐 권한 요구사항
                    - **프로젝트 생성자(팀장)만** 역할 수정 가능
                    - 해당 프로젝트의 소유자만 역할 정보 변경 권한 보유
                    
                    ## 📝 수정 가능 항목
                    
                    ### 🎯 역할 기본 정보
                    - **roleName**: 역할명 변경 (2-50자)
                      - 기존 역할명을 더 구체적이거나 명확하게 수정
                      - 예시: "개발자" → "프론트엔드 개발자"
                    - **roleDescription**: 역할 설명 수정 (10-500자)
                      - 업무 범위 변경이나 요구사항 추가/삭제
                      - 프로젝트 진행에 따른 역할 조정 반영
                    
                    ### 👥 인원 관리
                    - **requiredCount**: 필요 인원 수 조정
                      - ⚠️ **주의**: 현재 배정된 인원보다 적게 설정 불가
                      - 예시: 현재 2명 배정 → 최소 2명 이상으로만 수정 가능
                    
                    ## 🏷️ 선택 항목
                    - **additionalRequirements**: 추가 요구사항 수정
                      - 새로운 기술 요구사항 추가
                      - 기존 요구사항 완화 또는 강화
                    
                    ## ⚡ 처리 과정
                    1. 프로젝트 및 역할 존재 확인
                    2. 수정 권한 검증 (프로젝트 소유자)
                    3. 인원 수 제약 조건 확인
                    4. 역할 정보 업데이트
                    5. 총 모집 인원 수 재계산 및 업데이트
                    
                    ## 🔄 수정 시나리오
                    
                    ### 📈 확장 시나리오
                    - 프로젝트 규모 확대로 인한 인원 증원
                    - 새로운 기술 도입으로 인한 요구사항 추가
                    
                    ### 🔧 조정 시나리오
                    - 역할명 명확화 (모호한 이름 → 구체적 이름)
                    - 업무 범위 재정의 (역할 분담 조정)
                    
                    ## ⚠️ 수정 제한사항
                    - **인원 축소 제한**: 현재 배정 인원 이하로 감소 불가
                    - **진행 중 프로젝트**: 일부 핵심 정보 수정 제한 가능
                    - **지원자 존재시**: 역할 대폭 변경시 기존 지원자들에게 알림 필요
                    
                    ## 📤 응답
                    - 성공시: 수정 완료 확인 메시지
                    - 실패시: 구체적인 제한사항 및 해결방법 안내
                    """,
            security = {@SecurityRequirement(name = "bearer-key")}
    )
    @PutMapping("/{roleId}")
    public ResponseEntity<Void> updateProjectRole(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable("projectId") Long projectId,
            @PathVariable("roleId") Long roleId,
            @Valid @RequestBody RoleUpdateRequestDto request) {
        Long memberId = user.getMember().getMemberId();
        roleService.updateProjectRole(projectId, roleId, memberId, request);
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "프로젝트 역할 삭제",
            description = """
                    프로젝트에서 특정 역할을 삭제합니다.
                    
                    ## 🔐 권한 요구사항
                    - **프로젝트 생성자(팀장)만** 역할 삭제 가능
                    - 해당 프로젝트의 소유자만 역할 제거 권한 보유
                    
                    ## ⚠️ 삭제 가능 조건
                    
                    ### ✅ 삭제 허용 상황
                    - **빈 역할**: 현재 배정된 팀원이 없는 역할
                    - **지원자 없음**: 해당 역할에 대한 미처리 지원서가 없는 경우
                    - **불필요한 역할**: 프로젝트 방향 변경으로 더 이상 필요하지 않은 역할
                    
                    ### 🚫 삭제 불가 상황
                    - **팀원 배정됨**: 현재 해당 역할에 참여 중인 팀원이 있는 경우
                    - **대기 중인 지원서**: 검토 대기 중인 지원서가 있는 경우
                    - **마지막 역할**: 프로젝트의 유일한 역할인 경우 (최소 1개 역할 필요)
                    
                    ## ⚡ 처리 과정
                    1. 프로젝트 및 역할 존재 확인
                    2. 삭제 권한 검증 (프로젝트 소유자)
                    3. 삭제 가능 조건 확인
                       - 배정된 팀원 여부 체크
                       - 대기 중인 지원서 여부 체크
                       - 최소 역할 개수 조건 체크
                    4. 역할 삭제 실행
                    5. 총 모집 인원 수 재계산 및 업데이트
                    
                    ## 🔄 삭제 시나리오
                    
                    ### 📋 계획 변경
                    - 프로젝트 범위 축소로 인한 역할 제거
                    - 기술 스택 변경으로 불필요해진 역할 삭제
                    
                    ### 🎯 역할 통합
                    - 유사한 역할들을 하나로 통합하기 전 단계
                    - 중복된 역할 정리 및 최적화
                    
                    ### 🏗️ 프로젝트 재구성
                    - 팀 구조 변경에 따른 역할 재정의
                    - 효율적인 팀 운영을 위한 역할 간소화
                    
                    ## 💡 삭제 전 권장사항
                    
                    ### 📢 사전 안내
                    - 해당 역할에 관심 있던 잠재 지원자들에게 사전 공지
                    - 프로젝트 팀원들과의 충분한 논의
                    - 삭제되는 역할과 유사한 다른 역할 안내
                    - 기존 지원자들을 위한 대체 역할 제안
                    
                    ## 📤 응답 결과
                    - **성공시**: 역할 삭제 완료 및 변경된 총 모집 인원 정보
                    - **실패시**: 삭제 불가 사유와 해결 방법 상세 안내
                    
                    ## 🔄 후속 처리
                    - 총 프로젝트 모집 인원 수 자동 업데이트
                    - 관련 지원서 상태 정리 (존재할 경우)
                    - 프로젝트 모집 현황 갱신
                    """,
            security = {@SecurityRequirement(name = "bearer-key")}
    )
    @DeleteMapping("/{roleId}")
    public ResponseEntity<Void> deleteProjectRole(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable("projectId") Long projectId,
            @PathVariable("roleId") Long roleId) {
        Long memberId = user.getMember().getMemberId();
        roleService.deleteProjectRole(projectId, roleId, memberId);
        return ResponseEntity.ok().build();
    }

}
