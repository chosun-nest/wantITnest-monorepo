package com.virtukch.nest.project_application.dto;


import com.virtukch.nest.project_member.model.ProjectMember;
import lombok.Getter;


@Getter
public class ProjectApplicationRequestDto {
    private Long projectId;
    private ProjectMember.Part part;
}
