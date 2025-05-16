package com.virtukch.nest.project.dto.converter;

import com.virtukch.nest.project.dto.ProjectCreateResponseDto;
import com.virtukch.nest.project.model.Project;

public class ProjectDtoConverter {
    public static ProjectCreateResponseDto toCreateResponseDTO(Project createProject) {

        return ProjectCreateResponseDto.builder()
                .projectId(createProject.getProjectId())
                .message("프로젝트 모집글이 성공적으로 등록되었습니다.")
                .build();
    }
}
