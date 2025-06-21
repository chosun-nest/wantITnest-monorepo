package com.virtukch.nest.project.controller;

import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.project.dto.*;
import com.virtukch.nest.project.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "[프로젝트 모집 게시판] 게시글 API", description = "게시글 CRUD 등 게시판 관련 API\n문의 : dlwlgur02@gmail.com")
public class ProjectController {

    private final ProjectService projectService;

    // 프로젝트 생성
    @Operation(
        summary = "프로젝트 모집글 생성",
        description = """
            새로운 프로젝트 모집글을 생성합니다.

            ## 요청 필드
            - `projectTitle`: 제목 (필수)
            - `projectDescription`: 상세 설명 (선택)
            - `tags`: 태그 목록 (선택, 존재하는 태그만 가능)
            - `parts`: 모집 역할 및 인원 리스트 (필수)

            ✔️ 로그인된 사용자만 작성 가능
            ✔️ 성공 시 생성된 게시글의 URI를 Location 헤더로 반환
            """
    )
    @PostMapping("/new")
    public ResponseEntity<ProjectResponseDto> createProject(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody ProjectRequestDto requestDTO) {
        Long memberId = user.getMember().getMemberId();
        log.info("[모집글 작성 요청] memberId={}", memberId);
        ProjectResponseDto responseDto = projectService.createProject(memberId, requestDTO);
        return ResponseEntity
                .created(URI.create("/api/projects/" + responseDto.getProjectId()))
                .body(responseDto);
    }

    // 전체 프로젝트 조회
    @Operation(
        summary = "프로젝트 모집글 상세 조회",
        description = """
            특정 프로젝트 모집글의 상세 정보를 조회합니다.

            - `projectId`를 경로 변수로 전달  
            - 게시글 작성자, 설명, 모집 역할 등 포함
            """
    )
    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectDetailResponseDto> getProjectDetail(@PathVariable Long projectId) {
        ProjectDetailResponseDto responseDto = projectService.getProjectDetail(projectId);
        return ResponseEntity.ok(responseDto);
    }

    @Operation(
        summary = "전체 프로젝트 모집글 조회",
        description = """
            모든 프로젝트 모집글을 최신순으로 조회합니다.

            ## 태그 필터링
            - `?tags=JAVA&tags=SPRING` 등 다중 태그 필터 가능

            ## 페이지네이션
            - `page`: 페이지 번호 (0부터 시작)
            - `size`: 페이지당 항목 수 (기본값: 10)

            ## 정렬
            - `sort=createdAt,desc` 등

            ✔️ 태그가 없으면 전체 게시글 반환
            """
    )
    @GetMapping
    public ResponseEntity<ProjectListResponseDto> getProjects(
            @RequestParam(required = false) List<String> tags,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        ProjectListResponseDto responseDto;
        if(tags == null || tags.isEmpty()) {
            responseDto = projectService.getProjectList(pageable);
        } else {
            responseDto = projectService.getProjectList(tags, pageable);
        }
        return ResponseEntity.ok(responseDto);
    }


    //프로젝트 업데이트
    @Operation(
            summary = "프로젝트 모집글 수정",
            description = """
        기존 프로젝트 모집글의 내용을 수정합니다.

        ## 요청 필드 처리 방식
        - `projectTitle`: null 또는 생략 시 제목 변경 없음 / 빈 문자열은 허용하지 않음
        - `projectDescription`: null 또는 생략 시 본문 변경 없음 / 빈 문자열 입력 시 본문 삭제 처리
        - `tags`: null 또는 생략 시 태그 변경 없음 / 빈 배열 입력 시 모든 태그 제거
        - `partCounts`: null 또는 생략 시 모집 인원 및 역할 변경 없음 / Map<String, Integer> 형식으로 역할별 인원 지정

        ✔️ 작성자 본인만 수정 가능  
        ✔️ 수정 가능한 필드는 `ProjectUpdateRequestDto` 참고
        """
    )
    @PatchMapping("/{projectId}")
    public ResponseEntity<ProjectResponseDto> updateProject(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long projectId,
            @Valid @RequestBody ProjectRequestDto requestDto) {

        Long memberId = user.getMember().getMemberId();
        log.info("[모집글 수정 요청] projectId={}, memberId={}", projectId, memberId);
        ProjectResponseDto responseDto = projectService.updateProject(projectId, memberId, requestDto);
        return ResponseEntity.ok(responseDto);
    }

    @Operation(
        summary = "프로젝트 모집글 삭제",
        description = """
            프로젝트 모집글을 삭제합니다.

            - 작성자 본인만 삭제 가능  
            - 삭제된 게시글은 조회할 수 없습니다.
            """
    )
    @DeleteMapping("/{projectId}")
    public ResponseEntity<ProjectResponseDto> deleteProject(@AuthenticationPrincipal CustomUserDetails user,
                                                            @PathVariable Long projectId) {
        Long memberId = user.getMember().getMemberId();
        log.info("[모집글 삭제 요청] projectId={}, memberId={}", projectId, memberId);
        ProjectResponseDto responseDto = projectService.deleteProject(projectId, memberId);
        return ResponseEntity.ok(responseDto);
    }


    @Operation(
        summary = "게시글 검색",
        description = """
            키워드를 사용하여 게시글을 검색합니다.

            ## 검색 키워드
            - `keyword`: 검색할 키워드

            ## 검색 타입
            - `searchType`: 검색 타입 (ALL, TITLE, CONTENT)
                - ALL: 제목과 내용에서 검색 (기본값)
                - TITLE: 제목에서만 검색
                - CONTENT: 내용에서만 검색

            ## 태그 필터링
            - `?tags=JAVA&tags=SPRING` 등으로 전달

            ## 페이지네이션
            - `page`: 페이지 번호 (0부터 시작)
            - `size`: 페이지당 항목 수 (기본값: 10)

            ## 정렬
            - 단일: `?sort=createdAt,desc`
            - 다중: `?sort=viewCount,desc&sort=createdAt,desc`

            ## 전체 사용 예시
            - `/api/v1/posts/search?keyword=스프링&searchType=TITLE&page=0&size=10&sort=createdAt,desc&tags=JAVA`
            """
    )
    @GetMapping("/search")
    public ResponseEntity<ProjectListResponseDto> searchProjects(
            @RequestParam String keyword,
            @RequestParam(required = false, defaultValue = "ALL") String searchType,
            @RequestParam(required = false) List<String> tags,
            @PageableDefault(size = 10, sort = "createAt", direction = Sort.Direction.DESC) Pageable pageable) {

        ProjectListResponseDto responseDto;
        if(tags == null || tags.isEmpty()) {
            responseDto = projectService.searchProjects(keyword, searchType, pageable);
        } else {
            responseDto = projectService.searchProjectsWithTags(keyword, tags, searchType, pageable);
        }

        return ResponseEntity.ok(responseDto);
    }

}
