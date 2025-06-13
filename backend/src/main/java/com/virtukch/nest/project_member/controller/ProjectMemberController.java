package com.virtukch.nest.project_member.controller;


import com.virtukch.nest.project_member.model.ProjectMember;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
@Tag(name = "[프로젝트 모집 게시판] 역할 API", description = "프로젝트 참여 역할 관련 API\n문의 : dlwlgur02@gmail.com")
@RestController
@RequestMapping("/api/v1/projects/members")
@RequiredArgsConstructor
public class ProjectMemberController {
    @Operation(
        summary = "프로젝트 역할 목록 조회",
        description = """
            프로젝트 참여자의 역할(Enum)을 조회합니다.
            ✔️ 프론트엔드, 백엔드, 디자이너 등
            ✔️ 클라이언트에서 역할 선택용으로 사용
            """,
        security = {@SecurityRequirement(name = "bearer-key")}
    )
    @GetMapping
    public ResponseEntity<List<String>> getPartEnums() {
        List<String> parts = Arrays.stream(ProjectMember.Part.values())
                .map(Enum::name)
                .toList();
        return ResponseEntity.ok(parts);
    }
}
