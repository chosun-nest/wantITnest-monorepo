package com.virtukch.nest.project.dto;

import com.virtukch.nest.project_member.model.ProjectMember;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

import java.util.List;
import java.util.Map;

@Getter
public class ProjectRequestDto {
    @NotBlank(message = "모집글 제목은 비어 있을 수 없습니다.")
    private String projectTitle;
    private String projectDescription;
    private int maxMember;
    private boolean isRecruiting;
    private List<String> tags;
    private Map<ProjectMember.Part, Integer> partCounts;
    private ProjectMember.Part creatorPart; // 작성자가 들어갈 파트
    private ProjectMember.Role creatorRole = ProjectMember.Role.LEADER; // 기본값 LEADER
}
