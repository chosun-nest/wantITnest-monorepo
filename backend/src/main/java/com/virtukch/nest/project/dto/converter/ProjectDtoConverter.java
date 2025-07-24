package com.virtukch.nest.project.dto.converter;

import com.virtukch.nest.common.dto.AuthorDto;
import com.virtukch.nest.common.dto.PageInfoDto;
import com.virtukch.nest.project.dto.response.ProjectResponseDto;
import com.virtukch.nest.project.dto.response.ProjectListResponseDto;
import com.virtukch.nest.project.dto.response.ProjectSummaryDto;
import com.virtukch.nest.project.model.Project;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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

    private static ProjectResponseDto buildResponse(Project project, String message) {
        return ProjectResponseDto.builder()
                .projectId(project.getProjectId())
                .projectTitle(project.getProjectTitle())
                .status(project.getStatus())
                .currentMembers(project.getCurrentMembers())
                .totalMemberNeeded(project.getTotalMemberNeeded())
                .recruitmentEndDate(timeFormat(project.getRecruitmentEndDate()))
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
                .previewContent(generatePreview(project.getProjectDescription()))
                .status(project.getStatus())
                .isRecruiting(project.getIsRecruiting())
                .totalMemberNeeded(project.getTotalMemberNeeded())
                .currentMembers(project.getCurrentMembers())
                .recruitmentEndDate(timeFormat(project.getRecruitmentEndDate()))
                .createdAt(timeFormat(project.getCreatedAt()))
                .commentCount(commentCount)
                .author(AuthorDto.create(project.getMember()))
                .tags(tagNames)
                .viewCount(project.getViewCount())
                .build();
    }

    private static String timeFormat(LocalDateTime dateTime) {
        return dateTime.format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm"));
    }

    private static String generatePreview(String projectDescription) {
        if (projectDescription == null) return "";
        String plainText = projectDescription.replaceAll("\\*\\*", "")
                .replaceAll("#+", "")
                .replaceAll("```", "")
                .replaceAll("`", "")
                .replaceAll("> ", "")
                .replaceAll("\\[(.*?)]\\((.*?)\\)", "$1");
        return plainText.length() <= 100 ? plainText : plainText.substring(0, 100) + "...";
    }
}