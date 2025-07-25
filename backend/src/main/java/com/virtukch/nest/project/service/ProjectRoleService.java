package com.virtukch.nest.project.service;

import com.virtukch.nest.project.dto.converter.RoleDtoConverter;
import com.virtukch.nest.project.dto.response.RoleListDto;
import com.virtukch.nest.project.model.ProjectRole;
import com.virtukch.nest.project.repository.ProjectRoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProjectRoleService {

    private final ProjectService projectService;
    private final ProjectRoleRepository projectRoleRepository;

    public RoleListDto getProjectRole(Long projectId) {
        // techStack 패치조인
        List<ProjectRole> projectRoles = projectRoleRepository.findByProjectIdWithTechStacks(projectId);
        RoleDtoConverter.toListDto()
    }
}
