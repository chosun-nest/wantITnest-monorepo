package com.virtukch.nest.project.dto.converter;

import com.virtukch.nest.project.dto.ProjectCreateResponseDTO;
import com.virtukch.nest.project.model.Project;

public class ProjectDtoConverter {
    public static ProjectCreateResponseDTO toCreateResponseDTO(Project createProject) {

        return ProjectCreateResponseDTO.builder()
                .projectId(createProject.getProjectId())
                .message("프로젝트 모집글이 성공적으로 등록되었습니다.")
                .build();
    }
}
