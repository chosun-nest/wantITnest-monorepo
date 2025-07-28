package com.virtukch.nest.project.service;

import com.virtukch.nest.project.dto.converter.RoleDtoConverter;
import com.virtukch.nest.project.dto.converter.RoleTechStackDtoConverter;
import com.virtukch.nest.project.dto.request.RoleCreateRequestDto;
import com.virtukch.nest.project.dto.request.RoleTechStackRequestDto;
import com.virtukch.nest.project.dto.request.RoleUpdateRequestDto;
import com.virtukch.nest.project.dto.response.RoleDetailDto;
import com.virtukch.nest.project.dto.response.RoleListDto;
import com.virtukch.nest.project.dto.response.RoleTechStackDto;
import com.virtukch.nest.project.exception.ProjectException;
import com.virtukch.nest.project.exception.ProjectErrorCode;
import com.virtukch.nest.project.model.Project;
import com.virtukch.nest.project.model.ProjectRole;
import com.virtukch.nest.project.model.ProjectRoleTechStack;
import com.virtukch.nest.project.repository.ProjectRoleRepository;
import com.virtukch.nest.project.repository.ProjectRoleTechStackRepository;
import com.virtukch.nest.tech_stack.dto.TechStackResponseDto;
import com.virtukch.nest.tech_stack.exception.TechStackNotFoundException;
import com.virtukch.nest.tech_stack.model.TechStack;
import com.virtukch.nest.tech_stack.repository.TechStackRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProjectRoleService {

    private final ProjectRoleRepository projectRoleRepository;
    private final ProjectRoleTechStackRepository projectRoleTechStackRepository;
    private final ProjectService projectService;
    private final TechStackRepository techStackRepository;

    @Transactional(readOnly = true)
    public RoleListDto getProjectRole(Long projectId) {
        List<ProjectRole> roles = projectRoleRepository.findByProjectIdWithTechStacks(projectId);
        
        List<RoleDetailDto> roleDetailDtos = roles.stream()
                .map(this::buildDetailDto)
                .toList();

        Project project = projectService.findByIdOrThrow(projectId);
        Integer totalNeededMembers = project.getTotalMemberNeeded();
        Integer currentMembers = project.getCurrentMembers();
        
        return RoleDtoConverter.toListDto(roleDetailDtos, totalNeededMembers, currentMembers);
    }

    @Transactional
    public void createProjectRole(Long projectId, RoleCreateRequestDto request) {
        Project project = projectService.findByIdOrThrow(projectId);
        
        ProjectRole role = ProjectRole.create(
                request.getRoleName(),
                request.getRoleDescription(),
                request.getAdditionalRequirements(),
                request.getRequiredCount()
        );
        project.addRole(role);

        ProjectRole savedRole = projectRoleRepository.save(role);
        
        if (request.getTechStacks() != null && !request.getTechStacks().isEmpty()) {
            createRoleTechStacks(savedRole, request.getTechStacks());
        }
    }

    @Transactional
    public void updateProjectRole(Long projectId, Long roleId, RoleUpdateRequestDto request) {
        ProjectRole role = findProjectRoleOrThrow(projectId, roleId);
        
        updateRoleBasicInfo(role, request);
        
        if (request.getTechStacks() != null) {
            updateRoleTechStacks(role, request.getTechStacks());
        }
    }

    @Transactional
    public void deleteProjectRole(Long projectId, Long roleId) {
        ProjectRole role = findProjectRoleOrThrow(projectId, roleId);

        projectRoleTechStackRepository.deleteByProjectRole(role);
        projectRoleRepository.delete(role);
    }

    private RoleDetailDto buildDetailDto(ProjectRole role) {
        List<RoleTechStackDto> techStacks = role.getRoleTechStacks().stream()
                .map(roleTechStack -> RoleTechStackDtoConverter.toDto(
                        roleTechStack,
                        TechStackResponseDto.builder()
                                .techStackId(roleTechStack.getTechStack().getTechStackId())
                                .techStackName(roleTechStack.getTechStack().getTechStackName())
                                .build()
                ))
                .toList();

        return RoleDtoConverter.toDetailDto(role, techStacks);
    }

    private void createRoleTechStacks(ProjectRole role, List<RoleTechStackRequestDto> techStackRequests) {
        List<ProjectRoleTechStack> roleTechStacks = techStackRequests.stream()
                .map(techStackRequest -> {
                    TechStack techStack = techStackRepository.findById(techStackRequest.getTechStackId())
                            .orElseThrow(() -> new TechStackNotFoundException("techStack not found"));
                    return ProjectRoleTechStack.create(
                            role,
                            techStack,
                            techStackRequest.getIsRequired(),
                            techStackRequest.getProficiency()
                    );
                })
                .toList();

        projectRoleTechStackRepository.saveAll(roleTechStacks);
    }
    
    public ProjectRole findProjectRoleOrThrow(Long projectId, Long roleId) {
        return projectRoleRepository.findById(roleId)
                .filter(role -> role.getProject().getProjectId().equals(projectId))
                .orElseThrow(() -> new ProjectException(ProjectErrorCode.PROJECT_ROLE_NOT_FOUND));
    }
    
    private void updateRoleBasicInfo(ProjectRole role, RoleUpdateRequestDto request) {
        role.updateBasicInfo(
                request.getRoleName(),
                request.getRoleDescription(),
                request.getAdditionalRequirements(),
                request.getRequiredCount()
        );
    }
    
    private void updateRoleTechStacks(ProjectRole role, List<RoleTechStackRequestDto> techStackRequests) {
        projectRoleTechStackRepository.deleteByProjectRole(role);
        
        if (!techStackRequests.isEmpty()) {
            createRoleTechStacks(role, techStackRequests);
        }
    }
}
