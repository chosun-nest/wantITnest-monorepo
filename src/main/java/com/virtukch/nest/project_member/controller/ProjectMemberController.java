package com.virtukch.nest.project_member.controller;


import com.virtukch.nest.project_member.model.ProjectMember;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/project-members")
@RequiredArgsConstructor
public class ProjectMemberController {
    @GetMapping
    public ResponseEntity<List<String>> getPartEnums() {
        List<String> parts = Arrays.stream(ProjectMember.Part.values())
                .map(Enum::name)
                .toList();
        return ResponseEntity.ok(parts);
    }
}
