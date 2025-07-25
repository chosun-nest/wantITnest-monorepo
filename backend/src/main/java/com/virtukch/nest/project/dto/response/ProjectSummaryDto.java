package com.virtukch.nest.project.dto.response;

import com.virtukch.nest.common.dto.MemberSimpleDto;
import com.virtukch.nest.project.model.enums.ProjectStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class ProjectSummaryDto {
    private Long projectId;

    private String projectTitle;
    private String previewContent;

    private ProjectStatus status;
    private Boolean isRecruiting;

    private Integer totalMemberNeeded;
    private Integer currentMembers;

    private String recruitmentEndDate;  // 모집 마감 기한
    private String createdAt;           // 글 작성 시각 
    
    private Long commentCount;

    private MemberSimpleDto author;

    private List<String> tags;
    private Integer viewCount;
    private String imageUrl;
}
