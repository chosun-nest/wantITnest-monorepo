package com.virtukch.nest.project.controller;

import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.project.dto.ProjectResponseDto;
import com.virtukch.nest.project.dto.ProjectWithImagesRequestDto;
import com.virtukch.nest.project.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;


@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v2/projects")
@Tag(name = "[프로젝트 모집 게시판 with image] 게시글 API", description = "이미지를 포함한 게시글 CRUD 등 게시판 관련 API")
public class ProjectV2Controller {
    private final ProjectService projectService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProjectResponseDto> createProject(
            @AuthenticationPrincipal CustomUserDetails user,
            @ModelAttribute ProjectWithImagesRequestDto requestDto) {

        Long memberId = user.getMember().getMemberId();
        log.info("[모집글 작성 요청] memberId={}", memberId);

        ProjectResponseDto responseDto = projectService.createProject(memberId, requestDto);
        return ResponseEntity
                .created(URI.create("/api/v2/projects/" + responseDto.getProjectId()))
                .body(responseDto);
    }

    @PatchMapping(path = "/{projectId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProjectResponseDto> updateProject(@AuthenticationPrincipal CustomUserDetails user,
                                                            @PathVariable Long projectId,
                                                            @ModelAttribute ProjectWithImagesRequestDto requestDto) {
        Long memberId = user.getMember().getMemberId();
        log.info("[모집글 수정 요청] project={}, memberId={}", projectId, memberId);
        ProjectResponseDto responseDto = projectService.updateProject(memberId, projectId, requestDto);
        return ResponseEntity.ok(responseDto);
    }

}
