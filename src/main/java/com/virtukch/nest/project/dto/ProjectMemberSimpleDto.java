package com.virtukch.nest.project.dto;

import com.virtukch.nest.project_member.model.ProjectMember;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ProjectMemberSimpleDto {
    private ProjectMember.Part part;
    private ProjectMember.Role role;
    private Long memberId;
    private String memberName;
    private ProjectMember.ApplicationStatus applicationStatus;
}
