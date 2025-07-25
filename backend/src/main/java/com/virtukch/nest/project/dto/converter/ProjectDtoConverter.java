package com.virtukch.nest.project.dto.converter;

import com.virtukch.nest.common.dto.AuthorDto;
import com.virtukch.nest.common.dto.PageInfoDto;
import com.virtukch.nest.common.utils.DateUtils;
import com.virtukch.nest.common.utils.StringUtils;
import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.project.dto.common.RoleSimpleDto;
import com.virtukch.nest.project.dto.response.*;
import com.virtukch.nest.project.model.Project;
import com.virtukch.nest.project.model.ProjectParticipant;
import com.virtukch.nest.project.model.ProjectRole;
import org.springframework.data.domain.Page;

import java.util.List;

public class ProjectDtoConverter {

    public static ProjectResponseDto toCreateResponseDto(Project project) {
        return buildResponse(project, "프로젝트가 성공적으로 생성되었습니다.");
    }

    public static ProjectResponseDto toUpdateResponseDto(Project project) {
        return buildResponse(project, "게시글이 성공적으로 수정되었습니다.");
    }

    public static ProjectResponseDto toDeleteResponseDto(Project project) {
        return ProjectResponseDto.builder()
                .projectId(project.getProjectId())
                .projectTitle(project.getProjectTitle())
                .status(project.getStatus())
                .message("게시글이 성공적으로 삭제되었습니다.")
                .build();
    }

    public static ProjectDetailResponseDto toDetailResponseDto(Project project, List<String> tagNames) {
        Member author = project.getMember();

        List<ProjectRole> roles = project.getRoles();
        List<ProjectParticipant> participants = project.getParticipants();

        return ProjectDetailResponseDto.builder()
                .projectId(project.getProjectId())
                .projectTitle(project.getProjectTitle())
                .projectDescription(project.getProjectDescription())
                .status(project.getStatus())
                .totalMemberNeeded(project.getTotalMemberNeeded())
                .currentMembers(project.getCurrentMembers())
                .recruitmentEndDate(DateUtils.formatDateTime(project.getRecruitmentEndDate()))
                .projectStartDate(DateUtils.formatDateTime(project.getProjectStartDate()))
                .projectEndDate(DateUtils.formatDateTime(project.getProjectEndDate()))
                .createdAt(DateUtils.formatDateTime(project.getCreatedAt()))
                .updatedAt(DateUtils.formatDateTime(project.getUpdatedAt()))
                .viewCount(project.getViewCount())
                .author(AuthorDto.builder()
                        .id(author.getMemberId())
                        .name(author.getMemberName())
                        .memberImageUrl(author.getMemberImageUrl())
                        .build())
                .tags(tagNames)
                .roles(roles.stream()
                        .map(RoleDtoConverter::toSimpleDto)
                        .toList())
                .participants(null) // TODO
                .build();
    }

    private static ProjectResponseDto buildResponse(Project project, String message) {
        return ProjectResponseDto.builder()
                .projectId(project.getProjectId())
                .projectTitle(project.getProjectTitle())
                .status(project.getStatus())
                .currentMembers(project.getCurrentMembers())
                .totalMemberNeeded(project.getTotalMemberNeeded())
                .recruitmentEndDate(DateUtils.formatDateTime(project.getRecruitmentEndDate()))
                .message(message)
                .build();
    }

    public static ProjectListResponseDto toProjectListResponseDto(List<ProjectSummaryDto> summaries, Page<Project> page) {
        return ProjectListResponseDto.builder()
                .projects(summaries)
                .totalCount((int) page.getTotalElements())
                .pageInfo(PageInfoDto.create(page))
                .build();
    }

    public static ProjectSummaryDto toSummaryDto(Project project, List<String> tagNames, Long commentCount) {
        return ProjectSummaryDto.builder()
                .projectId(project.getProjectId())
                .projectTitle(project.getProjectTitle())
                .previewContent(StringUtils.generateTextPreview(project.getProjectDescription(), 100))
                .status(project.getStatus())
                .isRecruiting(project.getIsRecruiting())
                .totalMemberNeeded(project.getTotalMemberNeeded())
                .currentMembers(project.getCurrentMembers())
                .recruitmentEndDate(DateUtils.formatDateTime(project.getRecruitmentEndDate()))
                .createdAt(DateUtils.formatDateTime(project.getCreatedAt()))
                .commentCount(commentCount)
                .author(AuthorDto.create(project.getMember()))
                .tags(tagNames)
                .viewCount(project.getViewCount())
                .build();
    }
}