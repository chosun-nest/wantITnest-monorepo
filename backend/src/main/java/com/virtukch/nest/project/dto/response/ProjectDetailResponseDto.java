package com.virtukch.nest.project.dto.response;

import com.virtukch.nest.common.dto.MemberSimpleDto;
import com.virtukch.nest.project.dto.ParticipantDto;
import com.virtukch.nest.project.dto.common.RoleSimpleDto;
import com.virtukch.nest.project.model.enums.ProjectStatus;
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

    private ProjectStatus status;
    private Boolean isRecruiting;

    private Integer totalMemberNeeded;      // 프로젝트 필요 인원 수
    private Integer currentMembers;         // 현재 지원자 수

    private String recruitmentEndDate;      // 모집 마감 시간
    private String projectStartDate;        // 프로젝트 시작 시간
    private String projectEndDate;          // 프로젝트 종료 시간

    private String createdAt;               // 프로젝트 생성 시각
    private String updatedAt;               // 프로젝트 수정 시각

    private Integer viewCount;

    private MemberSimpleDto author;

    private List<String> tags;
    private List<String> imageUrls;

    private List<RoleSimpleDto> roles;
    private List<ParticipantDto> participants;

}
