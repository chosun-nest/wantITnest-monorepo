package com.virtukch.nest.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectDetailResponseDto {

    private Long projectId;

    private String projectTitle;

    private String projectDescription;

    private List<String> tags;

    private ProjectAuthorDto author;

    private Integer viewCount;

    private String createdAt;
    private String updatedAt;

    private Integer currentNumberOfMembers;
    private Integer maximumNumberOfMembers;

    private List<ProjectMemberSimpleDto> projectMembers;
    private Boolean isRecruiting;

}
