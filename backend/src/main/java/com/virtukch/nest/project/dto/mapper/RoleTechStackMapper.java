package com.virtukch.nest.project.dto.mapper;

import com.virtukch.nest.project.dto.response.RoleTechStackDto;
import com.virtukch.nest.project.model.ProjectRoleTechStack;
import com.virtukch.nest.project.model.enums.Proficiency;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RoleTechStackMapper {

    /**
     * ProjectRoleTechStack 엔티티를 RoleTechStackDto로 변환
     */
    @Mapping(source = "techStack.id", target = "techStackId")
    @Mapping(source = "techStack.name", target = "techStackName")
    RoleTechStackDto toDto(ProjectRoleTechStack projectRoleTechStack);
}
