package com.virtukch.nest.project.service;

import com.virtukch.nest.comment.model.BoardType;
import com.virtukch.nest.comment.repository.CommentRepository;
import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.member.service.MemberService;
import com.virtukch.nest.project.dto.converter.ProjectDtoConverter;
import com.virtukch.nest.project.dto.request.ProjectCreateRequestDto;
import com.virtukch.nest.project.dto.request.ProjectUpdateRequestDto;
import com.virtukch.nest.project.dto.request.RoleCreateRequestDto;
import com.virtukch.nest.project.dto.response.ProjectResponseDto;
import com.virtukch.nest.project.dto.response.ProjectListResponseDto;
import com.virtukch.nest.project.dto.response.ProjectSummaryDto;
import com.virtukch.nest.project.exception.NoProjectAuthorityException;
import com.virtukch.nest.project.exception.ProjectNotFoundException;
import com.virtukch.nest.project.model.*;
import com.virtukch.nest.project.model.enums.Position;
import com.virtukch.nest.project.repository.ProjectRepository;
import com.virtukch.nest.project.repository.ProjectTagRepository;
import com.virtukch.nest.tag.model.Tag;
import com.virtukch.nest.tag.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TagRepository tagRepository;
    private final CommentRepository commentRepository;
    private final MemberService memberService;
    private final ProjectTagRepository projectTagRepository;

    private final String prefix = "project";

    @Transactional
    public ProjectResponseDto createProject(Long memberId, ProjectCreateRequestDto requestDto) {
        String projectTitle = requestDto.getProjectTitle();
        log.info("[프로젝트 모집글 작성 시작] title={}, memberId={}", projectTitle, memberId);

        // projectId가 필요하므로 먼저 저장
        Member member = memberService.findOrThrow(memberId);
        Project project = projectRepository.save(Project.createProject(member, requestDto));

        List<RoleCreateRequestDto> roles = requestDto.getRoles();
        roles.forEach(role -> {
            ProjectRole projectRole = ProjectRole.createProjectRole(role);
            project.addRole(projectRole);
        });

        List<Tag> tags = tagRepository.findByNameIn(requestDto.getTags());
        tags.forEach(tag -> {
            ProjectTag projectTag = ProjectTag.createProjectTag(project, tag);
            project.addTag(projectTag);
        });
        
        ProjectRole creatorRole = project.getRoles().get(requestDto.getCreatorRoleIndex());
        ProjectParticipant participant = ProjectParticipant.createParticipant(memberId, creatorRole.getId(), Position.LEADER);
        project.addParticipant(participant); // 프로젝트 글 작성자가 LEADER

        return ProjectDtoConverter.toCreateResponseDto(project);
    }

    @Transactional
    public ProjectListResponseDto getProjectList(Pageable pageable) {
        Page<Project> projectPage = projectRepository.findAll(pageable);
        return buildListResponseDto(projectPage);
    }

    @Transactional(readOnly = true)
    public ProjectListResponseDto getProjectList(List<String> tagNames, Pageable pageable) {
        List<Tag> tags = tagRepository.findByNameIn(tagNames);
        List<ProjectTag> projectTags = projectTagRepository.findByTagIn(tags);
        Page<Project> projectPage = projectRepository.findByTags(projectTags, pageable);

        return buildListResponseDto(projectPage);
    }

    @Transactional
    public ProjectResponseDto updateProject(Long projectId, Long memberId, ProjectUpdateRequestDto requestDto) {
        Project project = validateProjectOwnershipAndGet(projectId, memberId);

        List<Tag> tags = tagRepository.findByNameIn(requestDto.getTagNames());
        List<ProjectTag> projectTags = projectTagRepository.findByTagIn(tags);

        project.updateProject(requestDto, projectTags);

        return ProjectDtoConverter.toUpdateResponseDto(project);
    }



    private ProjectListResponseDto buildListResponseDto(Page<Project> projectPage) {
        List<Project> projects = projectPage.getContent();
        Map<Long, Long> commentCountMap = fetchCommentCountMap(projects);

        List<ProjectSummaryDto> summaries = projects.stream().map(project -> ProjectDtoConverter.toSummaryDto(
                project,
                project.getTags().stream()
                        .map(projectTag -> projectTag.getTag().getName())
                        .toList(),
                commentCountMap.getOrDefault(project.getProjectId(), 0L)
        )).toList();

        return ProjectDtoConverter.toProjectListResponseDto(summaries, projectPage);
    }

    private Map<Long, Long> fetchCommentCountMap(List<Project> projects) {
        List<Long> projectIds = projects.stream().map(Project::getProjectId).toList();

        if (projectIds.isEmpty()) {
            return Collections.emptyMap();
        }

        return commentRepository.countByPostIdIn(BoardType.PROJECT, projectIds).stream()
                .collect(Collectors.toMap(
                        result -> (Long) result[0],  // postId
                        result -> (Long) result[1]   // count
                ));
    }

    private Project validateProjectOwnershipAndGet(Long projectId, Long memberId) {
        Project project = findByIdOrThrow(projectId);
        if(!project.getMember().getMemberId().equals(memberId)) {
            throw new NoProjectAuthorityException(projectId, memberId);
        }
        return project;
    }

    public Project findByIdOrThrow(Long projectId) {
        return projectRepository.findById(projectId).orElseThrow(() -> new ProjectNotFoundException(projectId));
    }
}
