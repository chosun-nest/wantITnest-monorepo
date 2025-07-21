package com.virtukch.nest.project.dto;

import com.virtukch.nest.project_member.model.ProjectParticipant;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ProjectMemberSimpleDto {
    private ProjectParticipant.Part part;
    private ProjectParticipant.Role role;
    private Long memberId;
    private String memberName;
}
