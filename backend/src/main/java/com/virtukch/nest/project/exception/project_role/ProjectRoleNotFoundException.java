package com.virtukch.nest.project.exception.project_role;

import lombok.Getter;

/**
 * 프로젝트 역할을 찾을 수 없거나 해당 프로젝트에 속하지 않을 때 발생하는 예외
 */
@Getter
public class ProjectRoleNotFoundException extends RuntimeException {
    
    public ProjectRoleNotFoundException(Long projectId, Long roleId) {
        super(String.format("프로젝트 ID %d에서 역할 ID %d를 찾을 수 없습니다.", projectId, roleId));
    }
    
    public ProjectRoleNotFoundException(String message) {
        super(message);
    }
}