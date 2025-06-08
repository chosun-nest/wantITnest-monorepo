package com.virtukch.nest.project.dto.converter;

import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.post.dto.AuthorDto;
import com.virtukch.nest.project.dto.*;
import com.virtukch.nest.project.model.Project;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class ProjectDtoConverter {

    public static ProjectResponseDto toCreateResponseDto(Project project) {
        return buildResponse(project, "게시글이 성공적으로 등록되었습니다.");
    }

    public static ProjectResponseDto toUpdateResponseDto(Project project) {
        return buildResponse(project, "게시글이 성공적으로 수정되었습니다.");
    }

    public static ProjectResponseDto toDeleteResponseDto(Project project) {
        return buildResponse(project, "게시글이 성공적으로 삭제되었습니다.");
    }

    private static ProjectResponseDto buildResponse(Project project, String message) {
        return ProjectResponseDto.builder()
                .projectId(project.getProjectId())
                .message(message)
                .build();
    }

    public static ProjectSummaryDto toSummaryDto(Project project, String memberName, List<String> tagNames, Long commentCount, String imageUrl) {
        return ProjectSummaryDto.builder()
                .projectId(project.getProjectId())
                .projectTitle(project.getProjectTitle())
                .previewContent(generatePreview(project.getProjectDescription()))
                .tags(tagNames)
                .author(AuthorDto.builder()
                        .id(project.getMemberId())
                        .name(memberName).build()
                )
                .viewCount(project.getViewCount())
                .createdAt(timeFormat(project.getCreatedAt()))
                .commentCount(commentCount)
                .imageUrl(imageUrl)
                .build();
    }

    public static ProjectDetailResponseDto toDetailResponseDto(Project project, Member member, List<String> tagNames) {
        return ProjectDetailResponseDto.builder()
                .projectId(project.getProjectId())
                .projectTitle(project.getProjectTitle())
                .projectDescription(project.getProjectDescription())
                .tags(tagNames)
                .author(ProjectAuthorDto.builder()
                        .id(member.getMemberId())
                        .name(member.getMemberName())
                        .build())
                .viewCount(project.getViewCount())
                .createdAt(timeFormat(project.getCreatedAt()))
                .updatedAt(timeFormat(project.getUpdatedAt()))
                .build();
    }

    public static ProjectListResponseDto toProjectListResponseDto(List<ProjectSummaryDto> summaries, Page<?> page) {
        return ProjectListResponseDto.builder()
                .projects(summaries)
                .totalCount((int) page.getTotalElements())
                .pageInfo(toPageInfoDto(page))
                .build();
    }

    public static ProjectPageInfoDto toPageInfoDto(Page<?> page) {
        return ProjectPageInfoDto.builder()
                .pageNumber(page.getNumber())
                .pageSize(page.getSize())
                .totalPages(page.getTotalPages())
                .totalElements(page.getTotalElements())
                .first(page.isFirst())
                .last(page.isLast())
                .hasNext(page.hasNext())
                .hasPrevious(page.hasPrevious())
                .build();
    }

    private static String timeFormat(LocalDateTime dateTime) {
        return dateTime.format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm"));
    }

    private static String generatePreview(String projectDescription) {
        if (projectDescription == null) return "";
        return projectDescription.length() <= 100 ? projectDescription : projectDescription.substring(0, 100) + "...";
    }
}