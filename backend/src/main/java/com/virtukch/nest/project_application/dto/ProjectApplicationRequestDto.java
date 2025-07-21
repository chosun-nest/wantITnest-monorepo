package com.virtukch.nest.project_application.dto;


import com.virtukch.nest.project_member.model.ProjectParticipant;
import lombok.Getter;


@Getter
public class ProjectApplicationRequestDto {
    private Long projectId;
    private ProjectParticipant.Part part;
}
