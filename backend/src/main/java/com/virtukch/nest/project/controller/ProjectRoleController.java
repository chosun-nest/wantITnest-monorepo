package com.virtukch.nest.project.controller;

import com.virtukch.nest.project.dto.response.RoleListDto;
import com.virtukch.nest.project.service.ProjectRoleService;
import com.virtukch.nest.project.service.ProjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/roles")
@RequiredArgsConstructor
@Slf4j
public class ProjectRoleController {

    private final ProjectRoleService roleService;
    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<RoleListDto> getProjectRole(@PathVariable("projectId") Long projectId) {

        return ResponseEntity.ok(roleService.getProjectRole(projectId));
    }
}
