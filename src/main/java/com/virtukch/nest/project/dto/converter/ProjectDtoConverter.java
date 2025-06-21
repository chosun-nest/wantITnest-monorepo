package com.virtukch.nest.project.dto.converter;

import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.post.dto.AuthorDto;
import com.virtukch.nest.project.dto.*;
import com.virtukch.nest.project.model.Project;
import com.virtukch.nest.project_member.model.ProjectMember;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

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

    public static ProjectSummaryDto toSummaryDto(Project project, String memberName, List<String> tagNames, Long commentCount, String imageUrl, Boolean isRecruiting, int currentNumberOfMembers, int maximumNumberOfMembers) {
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
                .isRecruiting(isRecruiting)
                .currentNumberOfMembers(currentNumberOfMembers)
                .maximumNumberOfMembers(maximumNumberOfMembers)
                .build();
    }

    public static ProjectDetailResponseDto toDetailResponseDto(Project project, Member leader, List<String> tagNames, List<ProjectMember> projectMemberList, Map<Long, String> memberIdToName, Boolean isRecruiting, int currentNumberOfMembers, int maximumNumberOfMembers) {
        List<ProjectMemberSimpleDto> memberDtos = projectMemberList.stream().map(pm -> {
            ProjectMemberSimpleDto dto = new ProjectMemberSimpleDto();
            dto.setPart(pm.getPart());
            dto.setRole(pm.getRole());
            if (pm.getMemberId() != null) {
                dto.setMemberId(pm.getMemberId());
                dto.setMemberName(memberIdToName.getOrDefault(pm.getMemberId(), "알 수 없음"));
            }
            return dto;
        }).toList();

        return ProjectDetailResponseDto.builder()
                .projectId(project.getProjectId())
                .projectTitle(project.getProjectTitle())
                .projectDescription(project.getProjectDescription())
                .tags(tagNames)
                .viewCount(project.getViewCount())
                .createdAt(timeFormat(project.getCreatedAt()))
                .updatedAt(timeFormat(project.getUpdatedAt()))
                .author(ProjectAuthorDto.builder()
                        .id(leader.getMemberId())
                        .name(leader.getMemberName())
                        .build())
                .projectMembers(memberDtos)
                .isRecruiting(isRecruiting)
                .currentNumberOfMembers(currentNumberOfMembers)
                .maximumNumberOfMembers(maximumNumberOfMembers)
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