package com.virtukch.nest.project.controller;

import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.common.dto.ApiResponseDto;
import com.virtukch.nest.project.dto.request.ProjectCreateRequestDto;
import com.virtukch.nest.project.dto.request.ProjectUpdateRequestDto;
import com.virtukch.nest.project.dto.response.ProjectDetailResponseDto;
import com.virtukch.nest.project.dto.response.ProjectListResponseDto;
import com.virtukch.nest.project.dto.response.ProjectResponseDto;
import com.virtukch.nest.project.model.enums.ProjectStatus;
import com.virtukch.nest.project.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "[프로젝트 모집 게시판] 프로젝트 기본 API", description = "프로젝트 생성, 조회, 수정, 삭제 등 기본 CRUD API")
public class ProjectController {

    private final ProjectService projectService;

    // 프로젝트 생성
    @Operation(
            summary = "프로젝트 생성",
            description = """
                    새로운 프로젝트 모집 게시글을 생성합니다.
                    
                    ## 📋 필수 입력 항목
                    
                    ### 🏗️ 프로젝트 기본 정보
                    - **projectTitle**: 프로젝트 제목 (2-100자)
                    - **projectDescription**: 프로젝트 상세 설명 (10-2000자)
                    - **projectStartDate**: 프로젝트 시작 예정일 (ISO 8601 형식: "2024-03-01")
                    - **projectEndDate**: 프로젝트 종료 예정일 (시작일 이후 날짜)
                    - **recruitmentEndDate**: 모집 마감일 (오늘 이후, 시작일 이전)
                    
                    ### 👥 역할(Role) 정보
                    - **roles**: 최소 1개 이상의 역할 배열 필수
                      - **roleName**: 역할명 (예: "프론트엔드 개발자", "백엔드 개발자")
                      - **roleDescription**: 역할 설명 및 담당 업무
                      - **requiredCount**: 해당 역할 모집 인원 (1명 이상)
                      - **additionalRequirements**: 추가 요구사항 (선택)
                    
                    ### 🎯 생성자 역할 지정
                    - **creatorRoleIndex**: 생성자가 담당할 역할의 인덱스 (0부터 시작)
                    
                    ## 🏷️ 선택 항목
                    - **tags**: 게시글 태그 배열
                    
                    ## ⚡ 처리 과정
                    1. 프로젝트 기본 정보 생성 및 저장
                    2. 요청된 역할들 생성 및 연결
                    3. 지정된 태그들 조회 및 연결
                    4. 생성자를 해당 역할의 LEADER로 자동 등록
                    5. 프로젝트 상태를 'RECRUITING'으로 설정
                    
                    ## 📤 응답 정보
                    - 생성된 프로젝트 ID 및 기본 정보
                    - Location 헤더에 생성된 프로젝트 URL 포함
                    - HTTP 201 Created 상태 코드
                    
                    ## ⚠️ 주의사항
                    - 총 모집 인원은 모든 역할의 requiredCount 합계로 자동 계산
                    - 존재하지 않는 태그는 무시됨
                    - 생성 후 프로젝트는 즉시 모집 상태가 됨
                    """,
            security = {@SecurityRequirement(name = "bearer-key")}
    )
    @PostMapping
    public ResponseEntity<ApiResponseDto<ProjectResponseDto>> createProject(@AuthenticationPrincipal CustomUserDetails user,
                                                                            @Valid @RequestBody ProjectCreateRequestDto requestDto) {
        Long memberId = user.getMember().getMemberId();
        ProjectResponseDto responseDto = projectService.createProject(memberId, requestDto);
        return ResponseEntity
                .created(URI.create("/api/v1/projects/" + responseDto.getProjectId()))
                .body(ApiResponseDto.created("프로젝트가 성공적으로 생성되었습니다.", responseDto));
    }

    @Operation(
            summary = "프로젝트 목록 조회",
            description = """
                    프로젝트 모집 게시글 목록을 조회합니다.
                    
                    ## 🔍 조회 기능
                    
                    ### 📊 기본 조회
                    - **전체 프로젝트**: 모든 공개된 프로젝트 목록 반환
                    - **활성 프로젝트 우선**: 모집 중이거나 진행 중인 프로젝트 우선 표시
                    - **최신순 정렬**: 생성일시 기준 내림차순 (최신 프로젝트가 상단)
                    - **공개 API**: 인증 없이도 조회 가능 (모든 사용자 접근 가능)
                    
                    ### 🏷️ 태그 필터링
                    - **전체 조회**: 태그 파라미터 없이 요청시 모든 프로젝트 반환
                    - **다중 태그 필터**: `?tags=JAVA&tags=SPRING&tags=REACT` 형태로 여러 태그 동시 필터링
                    - **OR 조건**: 지정된 태그 중 **하나라도** 포함된 프로젝트 반환
                    - **대소문자 구분**: 태그명은 정확히 일치해야 함
                    - **존재하지 않는 태그**: 모든 태그가 존재하지 않으면 빈 결과 반환
                    
                    ### 📊 상태 필터링
                    - **전체 조회**: 상태 파라미터 없이 요청시 삭제되지 않은 모든 프로젝트 반환
                    - **단일 상태 필터**: `?status=RECRUITING` 형태로 특정 상태만 필터링
                    - **상태 종류**: 
                      - `RECRUITING`: 팀원 모집 중인 프로젝트
                      - `CLOSED`: 모집이 마감된 프로젝트
                      - `IN_PROGRESS`: 현재 진행 중인 프로젝트
                      - `COMPLETED`: 완료된 프로젝트
                    - **제한사항**: `DELETED` 상태는 일반 사용자 조회에서 제외됨
                    
                    ### 📄 페이지네이션
                    - **페이지 크기**: `?size=10` (기본값: 10개, 최대 50개)
                    - **페이지 번호**: `?page=0` (기본값: 0, 첫 페이지부터 시작)
                    - **총 페이지 정보**: 응답에 전체 페이지 수, 총 프로젝트 수 포함
                    
                    ### 🔄 정렬 옵션
                    - **기본 정렬**: `createdAt` 내림차순 (최신순)
                    - **사용자 정의 정렬**: `?sort=title,asc` (제목 오름차순 등)
                    
                    ## 📊 응답 데이터
                    
                    ### 프로젝트 요약 정보
                    - **기본 정보**: ID, 제목, 설명 요약, 상태
                    - **모집 현황**: 총 모집 인원, 현재 인원, 남은 자리
                    - **일정 정보**: 모집 마감일, 프로젝트 시작/종료 예정일
                    - **태그 목록**: 해당 프로젝트의 모든 태그
                    - **댓글 수**: 프로젝트에 달린 댓글 개수
                    - **생성자 정보**: 프로젝트 생성자 기본 정보
                    
                    ## 🔗 URL 예시
                    ```
                    # 전체 프로젝트 (첫 페이지, 10개)
                    GET /api/v1/projects
                    
                    # Java, Spring 태그가 있는 프로젝트
                    GET /api/v1/projects?tags=JAVA&tags=SPRING
                    
                    # 모집 중인 프로젝트만 조회
                    GET /api/v1/projects?status=RECRUITING
                    
                    # Java 태그 + 진행 중인 프로젝트만 조회
                    GET /api/v1/projects?tags=JAVA&status=IN_PROGRESS
                    
                    # 2페이지, 20개씩, 제목 오름차순
                    GET /api/v1/projects?page=1&size=20&sort=title,asc
                    ```
                    """
    )
    @GetMapping
    public ResponseEntity<ApiResponseDto<ProjectListResponseDto>> getProjectList(
            @RequestParam(required = false) List<String> tags,
            @RequestParam(required = false) ProjectStatus status,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        ProjectListResponseDto responseDto = projectService.getProjectList(tags, status, pageable);
        return ResponseEntity.ok(ApiResponseDto.success("프로젝트 목록을 성공적으로 조회했습니다.", responseDto));
    }

    @Operation(
            summary = "내 프로젝트 목록 조회",
            description = """
                    현재 로그인한 사용자와 관련된 프로젝트 목록을 개인화하여 조회합니다.
                    
                    ## 🔐 인증 요구사항
                    - **로그인 필수**: JWT 토큰을 통한 사용자 인증 필요
                    - **개인 데이터**: 요청한 사용자의 프로젝트만 조회 가능
                    
                    ## 📊 조회 타입
                    
                    ### 👨‍💼 내가 생성한 프로젝트 (`type=created`)
                    - **기본값**: 파라미터 생략시 기본 동작
                    - **프로젝트 리더**: 내가 팀장으로 있는 모든 프로젝트
                    - **전체 권한**: 프로젝트 수정, 삭제, 관리 가능한 프로젝트들
                    - **상태 무관**: 모집 중, 진행 중, 완료된 프로젝트 모두 포함
                    
                    ### 👥 내가 참여 중인 프로젝트 (`type=participating`)
                    - **팀원 역할**: 내가 일반 팀원으로 참여 중인 프로젝트
                    - **활성 참여만**: 현재 ACTIVE 상태인 참여자로 등록된 프로젝트만
                    - **제한된 권한**: 프로젝트 정보 조회는 가능하지만 관리 권한 없음
                    - **탈퇴 제외**: 이전에 탈퇴한 프로젝트는 목록에서 제외
                    
                    ## 📄 페이지네이션 & 정렬
                    - **페이지 크기**: `?size=10` (기본값: 10개, 최대 50개)
                    - **페이지 번호**: `?page=0` (기본값: 0부터 시작)
                    - **정렬 기준**: `createdAt` 내림차순 (최근 생성/참여한 프로젝트 우선)
                    - **총 개수**: 응답에 전체 프로젝트 수와 페이지 정보 포함
                    
                    ## 📊 응답 데이터
                    
                    ### 프로젝트 요약 정보
                    - **기본 정보**: 프로젝트 ID, 제목, 상태, 생성일
                    - **내 역할**: 해당 프로젝트에서의 나의 역할과 권한 수준
                    - **진행 현황**: 현재 프로젝트 진행 단계 및 상태
                    - **팀 구성**: 현재 팀원 수, 모집 현황
                    - **중요 일정**: 모집 마감일, 프로젝트 시작/종료 예정일
                    
                    ## 🎯 활용 사례
                    
                    ### 📋 대시보드 표시
                    - **내 프로젝트 현황**: 생성한 프로젝트들의 모집/진행 상태 모니터링
                    - **참여 프로젝트 추적**: 내가 참여 중인 프로젝트들의 일정 및 진행상황 확인
                    
                    ### 🔄 프로젝트 관리
                    - **빠른 접근**: 자주 사용하는 프로젝트들에 대한 빠른 네비게이션
                    - **상태 확인**: 각 프로젝트별 현재 상황과 다음 액션 아이템 파악
                    
                    ## 🔗 URL 예시
                    ```
                    # 내가 생성한 프로젝트 (기본)
                    GET /api/v1/projects/my
                    GET /api/v1/projects/my?type=created
                    
                    # 내가 참여 중인 프로젝트
                    GET /api/v1/projects/my?type=participating
                    
                    # 2페이지, 20개씩 조회
                    GET /api/v1/projects/my?type=created&page=1&size=20
                    ```
                    """,
            security = {@SecurityRequirement(name = "bearer-key")}
    )
    @GetMapping("/my")
    public ResponseEntity<ApiResponseDto<ProjectListResponseDto>> getMyProjectList(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestParam(defaultValue = "created") String type,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Long memberId = user.getMember().getMemberId();
        
        ProjectListResponseDto responseDto;
        String message;
        if ("participating".equals(type)) {
            responseDto = projectService.getParticipatingProjectList(memberId, pageable);
            message = "참여 중인 프로젝트 목록을 성공적으로 조회했습니다.";
        } else {
            responseDto = projectService.getMyProjectList(memberId, pageable);
            message = "내가 등록한 프로젝트 목록을 성공적으로 조회했습니다.";
        }
        
        return ResponseEntity.ok(ApiResponseDto.success(message, responseDto));
    }

    @Operation(
            summary = "프로젝트 상세 조회",
            description = """
                    프로젝트 ID를 기반으로 프로젝트의 모든 상세 정보를 종합적으로 조회합니다.
                    
                    ## 🔍 조회 범위
                    - **공개 API**: 인증 없이도 모든 사용자가 조회 가능
                    - **전체 정보**: 프로젝트와 관련된 모든 상세 데이터 포함
                    - **실시간 현황**: 최신 모집 현황 및 팀 구성 상태 반영
                    
                    ## 📊 포함 정보
                    
                    ### 🏗️ 프로젝트 기본 정보
                    - **제목 및 설명**: 프로젝트명과 상세 설명
                    - **진행 상태**: RECRUITING(모집중), IN_PROGRESS(진행중), COMPLETED(완료) 등
                    - **프로젝트 일정**: 시작 예정일, 종료 예정일, 모집 마감일
                    - **생성자 정보**: 프로젝트 팀장의 기본 프로필 정보
                    - **생성 일시**: 프로젝트가 등록된 날짜와 시간
                    
                    ### 👥 팀 구성 및 모집 현황
                    - **전체 모집 현황**: 총 필요 인원 vs 현재 참여 인원
                    - **역할별 세부 현황**: 각 포지션별 모집 인원과 현재 인원
                    - **남은 자리**: 각 역할별로 추가로 모집 가능한 인원 수
                    - **모집 상태**: 역할별 모집 완료/진행 중 상태
                    
                    ### 🎯 역할별 상세 정보
                    - **역할 목록**: 프로젝트에서 필요한 모든 역할(포지션)
                    - **역할 설명**: 각 역할의 주요 업무와 책임사항
                    - **필요 기술 스택**: 역할별 요구되는 기술과 숙련도 수준
                    - **추가 요구사항**: 특별한 경험이나 자격 조건
                    - **현재 배정 현황**: 해당 역할에 현재 참여 중인 팀원 수
                    
                    ### 🏷️ 태그 및 카테고리
                    - **기술 태그**: 프로젝트에서 사용하는 주요 기술 스택
                    - **프로젝트 분야**: 웹개발, 모바일, 데이터 분석 등 분야 태그
                    - **태그 기반 검색**: 유사한 기술을 사용하는 다른 프로젝트 탐색 가능
                    
                    ## ⚠️ 주의사항
                    - **실시간 정보**: 모집 현황은 실시간으로 변경될 수 있음
                    - **지원 마감**: 모집 마감일 이후에도 정보 조회는 가능하지만 지원 불가
                    - **프로젝트 상태**: 진행 상태에 따라 일부 기능(지원하기 등)이 제한될 수 있음
                    """
    )
    @GetMapping("/{projectId}")
    public ResponseEntity<ApiResponseDto<ProjectDetailResponseDto>> getProjectDetail(@PathVariable Long projectId) {
        ProjectDetailResponseDto responseDto = projectService.getProjectDetail(projectId);
        return ResponseEntity.ok(ApiResponseDto.success("프로젝트 상세 정보를 성공적으로 조회했습니다.", responseDto));
    }

    @Operation(
            summary = "프로젝트 수정",
            description = """
                    기존 프로젝트의 정보를 수정합니다.
                    
                    ## 🔐 권한 요구사항
                    - **프로젝트 생성자 전용**: 해당 프로젝트를 생성한 사용자만 수정 가능
                    - **소유권 검증**: 요청자가 프로젝트 소유자인지 자동 확인
                    - **JWT 토큰 필수**: 인증된 사용자만 접근 가능
                    
                    ## 📝 수정 가능 항목
                    
                    ### 🏗️ 프로젝트 기본 정보
                    - **프로젝트 제목**: 더 명확하거나 매력적인 제목으로 변경
                    - **프로젝트 설명**: 상세 내용, 목표, 기대효과 등 보완
                    - **프로젝트 기간**: 시작일, 종료 예정일 조정 (현실적 일정 반영)
                    - **모집 마감일**: 충분한 지원자 확보를 위한 마감일 조정
                    
                    ### 🏷️ 태그 및 카테고리
                    - **기술 스택 태그**: 사용 기술 변경이나 추가 기술 반영
                    - **프로젝트 분야 태그**: 프로젝트 성격 변화에 따른 카테고리 조정
                    - **검색 최적화**: 더 많은 관련 지원자가 찾을 수 있도록 태그 최적화
                    
                    ## ⚡ 처리 과정
                    1. **권한 검증**: 요청자가 프로젝트 소유자인지 확인
                    2. **데이터 유효성 검사**: 입력된 정보의 형식과 제약조건 확인
                    3. **태그 처리**: 존재하는 태그만 연결, 없는 태그는 무시
                    4. **정보 업데이트**: 변경된 내용만 선택적으로 업데이트
                    5. **연관 데이터 동기화**: 관련된 다른 데이터들과의 일관성 유지
                    """,
            security = {@SecurityRequirement(name = "bearer-key")}
    )
    @PatchMapping("/{projectId}") // TODO : 수정 제한할 항목 논의 필요
    public ResponseEntity<ApiResponseDto<ProjectResponseDto>> updateProject(@AuthenticationPrincipal CustomUserDetails user,
                                                            @PathVariable Long projectId,
                                                            @RequestBody ProjectUpdateRequestDto requestDto) {
        Long memberId = user.getMember().getMemberId();
        ProjectResponseDto responseDto = projectService.updateProject(projectId, memberId, requestDto);

        return ResponseEntity.ok(ApiResponseDto.success("프로젝트가 성공적으로 수정되었습니다.", responseDto));
    }

    @Operation(
            summary = "프로젝트 삭제",
            description = """
                    프로젝트를 삭제합니다.
                    
                    ### 권한
                    - 프로젝트 생성자만 삭제 가능
                    
                    ### 삭제 정책
                    - **소프트 삭제 방식**: 실제 데이터는 삭제되지 않고 상태만 DELETED로 변경
                    - **복구 불가**: 일반 사용자 인터페이스에서는 복구 기능 제공하지 않음
                    - **연관 데이터 보존**: 지원서, 참여자 정보 등 모든 연관 데이터 유지
                    
                    ### 주의사항
                    - **중복 삭제 방지**: 이미 삭제된 프로젝트 재삭제시 404 에러 반환
                    - **접근 차단**: 삭제된 프로젝트는 모든 조회 API에서 제외됨
                    - **데이터 보존**: 관리자는 백엔드에서 삭제된 데이터 복구 가능
                    """,
            security = {@SecurityRequirement(name = "bearer-key")}
    )
    // 소프트 삭제 방식으로 구현완료 - 연관 데이터 보존됨
    @DeleteMapping("/{projectId}")
    public ResponseEntity<ApiResponseDto<ProjectResponseDto>> deleteProject(@AuthenticationPrincipal CustomUserDetails user,
                                                            @PathVariable Long projectId) {  
        Long memberId = user.getMember().getMemberId();
        ProjectResponseDto responseDto = projectService.deleteProject(projectId, memberId);
        return ResponseEntity.ok(ApiResponseDto.success("프로젝트가 성공적으로 삭제되었습니다.", responseDto));
    }

}
