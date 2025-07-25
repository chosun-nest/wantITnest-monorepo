package com.virtukch.nest.project.controller;

import com.virtukch.nest.project.dto.request.RoleCreateRequestDto;
import com.virtukch.nest.project.dto.request.RoleUpdateRequestDto;
import com.virtukch.nest.project.dto.response.RoleListDto;
import com.virtukch.nest.project.service.ProjectRoleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/roles")
@RequiredArgsConstructor
@Slf4j
public class ProjectRoleController {

    private final ProjectRoleService roleService;

    @GetMapping
    public ResponseEntity<RoleListDto> getProjectRole(@PathVariable("projectId") Long projectId) {
        return ResponseEntity.ok(roleService.getProjectRole(projectId));
    }

    @PostMapping
    public ResponseEntity<Void> createProjectRole(
            @PathVariable("projectId") Long projectId,
            @Valid @RequestBody RoleCreateRequestDto request) {
        roleService.createProjectRole(projectId, request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{roleId}")
    public ResponseEntity<Void> updateProjectRole(
            @PathVariable("projectId") Long projectId,
            @PathVariable("roleId") Long roleId,
            @Valid @RequestBody RoleUpdateRequestDto request) {
        roleService.updateProjectRole(projectId, roleId, request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{roleId}")
    public ResponseEntity<Void> deleteProjectRole(
            @PathVariable("projectId") Long projectId,
            @PathVariable("roleId") Long roleId) {
        roleService.deleteProjectRole(projectId, roleId);
        return ResponseEntity.ok().build();
    }

}
