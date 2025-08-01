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
    public void createProjectRole(Long projectId, Long memberId, RoleCreateRequestDto request) {
        Project project = projectService.findByIdOrThrow(projectId);
        
        // 1. 권한 검증: 프로젝트 소유자만 역할 생성 가능
        validateProjectOwnership(project, memberId);
        
        // 2. 중복 역할명 검증
        validateDuplicateRoleName(project, request.getRoleName());
        
        // 3. 최대 역할 개수 검증 (최대 10개)
        validateMaxRoleCount(project);
        
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
        
        // 4. 총 모집 인원 수 업데이트
        updateProjectTotalMemberCount(project);
    }

    @Transactional
    public void updateProjectRole(Long projectId, Long roleId, Long memberId, RoleUpdateRequestDto request) {
        ProjectRole role = findProjectRoleOrThrow(projectId, roleId);
        Project project = role.getProject();
        
        // 1. 권한 검증: 프로젝트 소유자만 역할 수정 가능
        validateProjectOwnership(project, memberId);
        
        // 2. 역할명 중복 검증 (기존 역할명과 다른 경우만)
        if (!role.getRoleName().equals(request.getRoleName())) {
            validateDuplicateRoleName(project, request.getRoleName());
        }
        
        // 3. 인원 수 제약 조건 검증 (현재 배정된 인원보다 적게 설정 불가)
        validateRequiredCountConstraint(role, request.getRequiredCount());
        
        updateRoleBasicInfo(role, request);
        
        if (request.getTechStacks() != null) {
            updateRoleTechStacks(role, request.getTechStacks());
        }
        
        // 4. 총 모집 인원 수 업데이트
        updateProjectTotalMemberCount(project);
    }

    @Transactional
    public void deleteProjectRole(Long projectId, Long roleId, Long memberId) {
        ProjectRole role = findProjectRoleOrThrow(projectId, roleId);
        Project project = role.getProject();
        
        // 1. 권한 검증: 프로젝트 소유자만 역할 삭제 가능
        validateProjectOwnership(project, memberId);
        
        // 2. 삭제 가능 조건 검증
        validateRoleDeletionConstraints(project, role);

        projectRoleTechStackRepository.deleteByProjectRole(role);
        projectRoleRepository.delete(role);
        
        // 3. 총 모집 인원 수 업데이트
        updateProjectTotalMemberCount(project);
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
                .filter(role -> role.getProject().getId().equals(projectId))
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
    
    // ============== 검증 메서드들 ==============
    
    /**
     * 프로젝트 소유자 권한 검증
     */
    private void validateProjectOwnership(Project project, Long memberId) {
        if (!project.getMember().getMemberId().equals(memberId)) {
            throw new ProjectException(ProjectErrorCode.NO_PROJECT_AUTHORITY);
        }
    }
    
    /**
     * 중복 역할명 검증
     */
    private void validateDuplicateRoleName(Project project, String roleName) {
        boolean isDuplicate = project.getRoles().stream()
                .anyMatch(role -> role.getRoleName().equals(roleName));
        
        if (isDuplicate) {
            throw new ProjectException(ProjectErrorCode.DUPLICATE_ROLE_NAME);
        }
    }
    
    /**
     * 최대 역할 개수 검증 (최대 10개)
     */
    private void validateMaxRoleCount(Project project) {
        if (project.getRoles().size() >= 10) {
            throw new ProjectException(ProjectErrorCode.MAX_ROLE_COUNT_EXCEEDED);
        }
    }
    
    /**
     * 필요 인원 수 제약 조건 검증 (현재 배정된 인원보다 적게 설정 불가)
     */
    private void validateRequiredCountConstraint(ProjectRole role, Integer newRequiredCount) {
        if (newRequiredCount < role.getCurrentCount()) {
            throw new ProjectException(ProjectErrorCode.INVALID_REQUIRED_COUNT);
        }
    }
    
    /**
     * 역할 삭제 가능 조건 검증
     */
    private void validateRoleDeletionConstraints(Project project, ProjectRole role) {
        // 1. 마지막 역할인지 확인 (최소 1개 역할 필요)
        if (project.getRoles().size() <= 1) {
            throw new ProjectException(ProjectErrorCode.CANNOT_DELETE_LAST_ROLE);
        }
        
        // 2. 현재 배정된 팀원이 있는지 확인
        if (role.getCurrentCount() > 0) {
            throw new ProjectException(ProjectErrorCode.CANNOT_DELETE_ROLE_WITH_MEMBERS);
        }
        
        // 3. 대기 중인 지원서가 있는지 확인 (추후 구현 가능)
        // validatePendingApplications(role);
    }
    
    /**
     * 총 모집 인원 수 업데이트
     */
    private void updateProjectTotalMemberCount(Project project) {
        Integer totalNeeded = project.getRoles().stream()
                .mapToInt(ProjectRole::getRequiredCount)
                .sum();
        
        project.updateTotalMemberNeeded(totalNeeded);
    }
}
