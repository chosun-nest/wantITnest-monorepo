package com.virtukch.nest.project.controller;

import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.common.dto.ApiResponseDto;
import com.virtukch.nest.project.dto.request.ProjectCreateRequestDto;
import com.virtukch.nest.project.dto.request.ProjectStatusUpdateRequestDto;
import com.virtukch.nest.project.dto.request.ProjectUpdateRequestDto;
import com.virtukch.nest.project.dto.response.ProjectDetailResponseDto;
import com.virtukch.nest.project.dto.response.ProjectListResponseDto;
import com.virtukch.nest.project.dto.response.ProjectResponseDto;
import com.virtukch.nest.project.model.enums.ProjectStatus;
import com.virtukch.nest.project.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "[프로젝트 모집 게시판] 게시글 API", description = "프로젝트 CRUD API")
public class ProjectController {

    private final ProjectService projectService;

    // 프로젝트 생성
    @Operation(
            summary = "프로젝트 생성",
            description = """
                    프로젝트 모집 게시글을 생성합니다.
                    
                    ### 필수 항목
                    - 프로젝트 제목, 설명, 시작 예정일, 기간, 모집 마감일
                    - 최소 하나 이상의 역할(Role) 정보
                    
                    ### 선택 항목
                    - 프로젝트 태그
                    """,
            security = {@SecurityRequirement(name = "bearer-key")}
    )
    @PostMapping
    public ResponseEntity<ApiResponseDto<ProjectResponseDto>> createProject(@AuthenticationPrincipal CustomUserDetails user,
                                                                            @RequestBody ProjectCreateRequestDto requestDto) {
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
                    
                    ## 태그 필터링
                    - 태그 필터링을 하지 않으면 전체 프로젝트를 반환합니다.
                    - 태그를 필터링하려면 `?tags=JAVA&tags=SPRING`과 같이 쿼리 파라미터로 전달하세요.
                    
                    ## 페이지네이션
                    - 페이지 번호: `?page=0` (기본값: 0, 첫 페이지)
                    - 페이지 크기: `?size=10` (기본값: 10, 페이지당 10개 항목)
                    
                    ## 정렬
                    - 기본 정렬: 생성일시 내림차순 (최신순)
                    
                    ## 전체 사용 예시
                    - `/api/v1/projects?page=0&size=10&tags=JAVA&tags=SPRING`
                    """
    )
    @GetMapping
    public ResponseEntity<ApiResponseDto<ProjectListResponseDto>> getProjectList(
            @RequestParam(required = false) List<String> tags,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        ProjectListResponseDto responseDto;
        if(tags == null || tags.isEmpty()) {
            responseDto = projectService.getProjectList(pageable);
        } else {
            responseDto = projectService.getProjectList(tags, pageable);
        }
        return ResponseEntity.ok(ApiResponseDto.success("프로젝트 목록을 성공적으로 조회했습니다.", responseDto));
    }

    @Operation(
            summary = "내 프로젝트 목록 조회",
            description = """
                    현재 로그인한 사용자와 관련된 프로젝트 목록을 조회합니다.
                    
                    ## 조회 타입
                    - `type=created` (기본값): 내가 등록한 프로젝트
                    - `type=participating`: 내가 참여 중인 프로젝트
                    
                    ## 페이지네이션
                    - 페이지 번호: `?page=0` (기본값: 0, 첫 페이지)
                    - 페이지 크기: `?size=10` (기본값: 10, 페이지당 10개 항목)
                    
                    ## 정렬
                    - 기본 정렬: 생성일시 내림차순 (최신순)
                    
                    ## 사용 예시
                    - `/api/v1/projects/my` (내가 등록한 프로젝트)
                    - `/api/v1/projects/my?type=created` (내가 등록한 프로젝트)
                    - `/api/v1/projects/my?type=participating` (내가 참여 중인 프로젝트)
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
                    프로젝트 ID를 기반으로 프로젝트 상세 정보를 조회합니다.
                    
                    ### 포함 정보
                    - 프로젝트 기본 정보 (제목, 설명, 기간 등)
                    - 역할별 상세 정보 및 필요 기술 스택
                    - 프로젝트 태그 및 이미지
                    - 모집 상태 및 현재 지원자 수
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
                    프로젝트 정보를 수정합니다.
                    
                    ### 권한
                    - 프로젝트 생성자만 수정 가능
                    
                    ### 수정 가능 항목
                    - 프로젝트 기본 정보 (제목, 설명, 기간 등)
                    - 역할 정보 및 기술 스택
                    - 프로젝트 태그 및 이미지
                    
                    ### 주의사항
                    - 이미 진행 중인 프로젝트의 경우 일부 항목 수정 제한
                    - 요구사항 논의 필요
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
                    - 소프트 삭제 방식 적용
                    - 관련된 지원서 및 참여자 정보도 함께 처리
                    
                    ### 주의사항
                    - 이미 진행 중인 프로젝트의 경우 삭제 제한 가능
                    """,
            security = {@SecurityRequirement(name = "bearer-key")}
    )
    // TODO: 요구사항 정리 필요 -> 지금은 연관관계 이런 거 다 무시하고 바로 삭제해버림
    @DeleteMapping("/{projectId}")
    public ResponseEntity<ApiResponseDto<ProjectResponseDto>> deleteProject(@AuthenticationPrincipal CustomUserDetails user,
                                                            @PathVariable Long projectId) {  
        Long memberId = user.getMember().getMemberId();
        ProjectResponseDto responseDto = projectService.deleteProject(projectId, memberId);
        return ResponseEntity.ok(ApiResponseDto.success("프로젝트가 성공적으로 삭제되었습니다.", responseDto));
    }

    @Operation(
            summary = "프로젝트 상태 변경",
            description = """
                    프로젝트 상태를 변경합니다.
                    - 모집중 → 진행중 → 완료 상태 관리
                    """,
            security = {@SecurityRequirement(name = "bearer-key")}
    )
    @PatchMapping("/{projectId}/status")
    public ResponseEntity<ApiResponseDto<Void>> updateProjectStatus(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long projectId,
            @RequestBody ProjectStatusUpdateRequestDto requestDto
    ) {
        // 모집중 → 진행중 → 완료 상태 관리
        Long memberId = user.getMember().getMemberId();
        projectService.updateProjectStatus(projectId, memberId, requestDto);

        ProjectStatus prevStatus = projectService.findByIdOrThrow(projectId).getStatus();
        ProjectStatus newStatus = requestDto.getStatus();

        return ResponseEntity.ok(ApiResponseDto.success(String.format("프로젝트 상태를 %s에서 %s로 변경하였습니다", prevStatus, newStatus)));
    }
}
