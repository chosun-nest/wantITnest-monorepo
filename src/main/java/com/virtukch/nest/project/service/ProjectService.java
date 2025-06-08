package com.virtukch.nest.project.service;

import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.member.repository.MemberRepository;
import com.virtukch.nest.post.repository.PostRepository;
import com.virtukch.nest.project.dto.*;
import com.virtukch.nest.project.dto.converter.ProjectDtoConverter;
import com.virtukch.nest.project.exception.NoProjectAuthorityException;
import com.virtukch.nest.project.exception.ProjectNotFoundException;
import com.virtukch.nest.project.model.Project;
import com.virtukch.nest.project.repository.ProjectRepository;
import com.virtukch.nest.project_member.repository.ProjectMemberRepository;
import com.virtukch.nest.project_tag.model.ProjectTag;
import com.virtukch.nest.project_tag.repository.ProjectTagRepository;
import com.virtukch.nest.tag.model.Tag;
import com.virtukch.nest.tag.repository.TagRepository;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import com.virtukch.nest.tag.service.TagService;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final MemberRepository memberRepository;
    private final ProjectMemberRepository projectMemberRepository; // ✅ 추가
    private final ProjectTagRepository projectTagRepository;
    private final TagService tagService;
//    private final CommentRepository commentRepository;
    private final TagRepository tagRepository;
    private final PostRepository postRepository;

    @Transactional
    public ProjectResponseDto createProject(Long memberId, ProjectRequestDto dto) {
        String projectTitle = dto.getProjectTitle();
        log.info("[프로젝트 모집글 작성 시작] title={}, memberId={}", projectTitle, memberId);

        Project project = projectRepository.save(Project.createProject(memberId, projectTitle, dto.getProjectDescription(), dto.getMaxMember()));

        saveProjectTags(project, dto.getTags());
        // builder 내부에서 LEADER 자동 등록됨
        return ProjectDtoConverter.toCreateResponseDto(project);
    }

    @Transactional(readOnly = true)
    public List<ProjectResponseDto> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(project -> ProjectResponseDto.builder()
                        .projectId(project.getProjectId())
                        .message("Complete Create Project")
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public ProjectDetailResponseDto getProjectDetail(Long projectId) {
        Project project = findByIdOrThrow(projectId);
        project.incrementViewCount();

        Member member = findMemberOrThrow(project);
        List<String> tagNames = extractTagNames(projectId);

        return ProjectDtoConverter.toDetailResponseDto(project, member, tagNames);
    }

    // 게시글 목록 조회
    @Transactional(readOnly = true)
    public ProjectListResponseDto getProjectList(Pageable pageable) {
        Page<com.virtukch.nest.project.model.Project> projectPage = projectRepository.findAll(pageable);
        return buildProjectListResponse(projectPage);
    }

    @Transactional(readOnly = true)
    public ProjectListResponseDto getProjectList(List<String> tags, Pageable pageable) {
        List<Long> tagIds = tags.stream()
                .map(tagService::findByNameOrThrow)
                .map(Tag::getId)
                .toList();
        Page<Project> projectPage = projectRepository.findByTagIds(tagIds, pageable);
        return buildProjectListResponse(projectPage);
    }

    @Transactional
    public ProjectResponseDto updateProject(Long projectId, Long memberId, ProjectRequestDto requestDto) {
        Project project = validateProjectOwnershipAndGet(projectId, memberId);
        project.updateProject(requestDto.getProjectTitle(),
                requestDto.getProjectDescription(),
                requestDto.getMaxMember(),
                requestDto.isRecruiting());

        projectTagRepository.deleteAllByProjectId(projectId);

        saveProjectTags(project, requestDto.getTags());

        return ProjectDtoConverter.toUpdateResponseDto(project);
    }

    @Transactional
    public ProjectResponseDto deleteProject(Long projectId, Long memberId) {
        Project project = validateProjectOwnershipAndGet(projectId, memberId);

        projectTagRepository.deleteAllByProjectId(projectId);
//        commentRepository.deleteAllByProjectId(projectId);
        projectRepository.delete(project);
        return ProjectDtoConverter.toDeleteResponseDto(project);
    }

    @Transactional(readOnly = true)
    public com.virtukch.nest.project.model.Project findByIdOrThrow(Long projectId) {
        return projectRepository.findById(projectId).orElseThrow(() -> new ProjectNotFoundException(projectId));
    }

    @Transactional(readOnly = true)
    public com.virtukch.nest.project.model.Project findOwnedProjectOrThrow(Long projectId, Long memberId) {
        com.virtukch.nest.project.model.Project project = findByIdOrThrow(projectId);
        if(!Objects.equals(project.getProjectLeader(), memberId)) {
            throw new NoProjectAuthorityException(projectId, memberId);
        }
        return project;
    }

    @Transactional
    public Project validateProjectOwnershipAndGet(Long projectId, Long memberId) {
        Project project = findByIdOrThrow(projectId);
        if(!Objects.equals(project.getMemberId(), memberId)) {
            throw new NoProjectAuthorityException(projectId, memberId);
        }
        return project;
    }

    @Transactional
    protected void saveProjectTags(Project project, List<String> tagNames) {
        List<String> tags = (tagNames == null || tagNames.isEmpty())
                ? List.of("UNCATEGORIZED")
                : tagNames;

        tags.stream()
                .map(tagService::findByNameOrThrow)
                .map(tag -> new ProjectTag(project.getProjectId(), tag.getId()))
                .forEachOrdered(projectTagRepository::save);
    }


    @Transactional(readOnly = true)
    public ProjectListResponseDto searchProjects(String keyword, String searchType, Pageable pageable) {
        Page<Project> projectPage;

        switch (searchType) {
            case "TITLE" -> projectPage = projectRepository
                    .findByProjectTitleContainingIgnoreCase(keyword, pageable);
            case "CONTENT" -> projectPage = projectRepository
                    .findByProjectDescriptionContainingIgnoreCase(keyword, pageable);
            default -> projectPage = projectRepository
                    .findByProjectTitleContainingIgnoreCaseOrProjectDescriptionContainingIgnoreCase(keyword, keyword, pageable);
        }
        return buildProjectListResponse(projectPage);
    }

    @Transactional(readOnly = true)
    public ProjectListResponseDto searchProjectsWithTags(String keyword, List<String> tags, String searchType, Pageable pageable) {
        List<Long> tagIds = tags.stream()
                .map(tagService::findByNameOrThrow)
                .map(Tag::getId)
                .toList();

        List<Long> projectIds = projectTagRepository.findByTagIdIn(tagIds).stream()
                .map(ProjectTag::getProjectId)
                .distinct()
                .toList();

        if(projectIds.isEmpty()) {
            Page<Project> emptyPage = new PageImpl<>(List.of(), pageable, 0);
            return buildProjectListResponse(emptyPage);
        }

        Page<Project> projectPage;
        switch (searchType.toUpperCase()) {
            case "TITLE" -> projectPage = projectRepository
                    .findByProjectIdInAndProjectTitleContainingIgnoreCase(projectIds, keyword, pageable);
            case "CONTENT" -> projectPage = projectRepository
                    .findByProjectIdInAndProjectDescriptionContaining(projectIds, keyword, pageable);
            default -> projectPage = projectRepository
                    .findByProjectIdInAndProjectTitleContainingIgnoreCaseOrProjectIdInAndProjectDescriptionContainingIgnoreCase(projectIds, keyword, projectIds, keyword, pageable);
        }

        return buildProjectListResponse(projectPage);
    }


    private List<String> extractTagNames(Long projectId) {
        List<ProjectTag> projectTags = projectTagRepository.findAllByProjectId(projectId);
        List<Long> tagIds = projectTags.stream()
                .map(ProjectTag::getTagId)
                .toList();

        Map<Long, String> tagNameMap = tagRepository.findAllById(tagIds).stream()
                .collect(Collectors.toMap(Tag::getId, Tag::getName));

        return tagIds.stream()
                .map(tagNameMap::get)
                .filter(Objects::nonNull)
                .toList();
    }

    private Member findMemberOrThrow(Project project) {
        return memberRepository.findById(project.getMemberId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private ProjectListResponseDto buildProjectListResponse(Page<com.virtukch.nest.project.model.Project> projectPage) {
        List<com.virtukch.nest.project.model.Project> projects = projectPage.getContent();

        Map<Long, String> memberNameMap = fetchMemberNameMap(projects);
        Map<Long, List<Long>> projectTagMap = fetchPostTagMap(projects);
        Map<Long, String> tagNameMap = fetchTagNameMap(projectTagMap);

        List<ProjectSummaryDto> summaries = projects.stream()
                .map(project -> buildProjectSummaryDto(project, memberNameMap, projectTagMap, tagNameMap))
                .toList();

        return ProjectDtoConverter.toProjectListResponseDto(summaries, projectPage);
    }

    private Map<Long, String> fetchMemberNameMap(List<Project> projects) {
        List<Long> memberIds = projects.stream()
                .map(Project::getMemberId)
                .distinct()
                .toList();
        return memberRepository.findAllById(memberIds).stream()
                .collect(Collectors.toMap(Member::getMemberId, Member::getMemberName));
    }

    private Map<Long, List<Long>> fetchPostTagMap(List<Project> projects) {
        List<Long> projectIds = projects.stream()
                .map(Project::getProjectId)
                .toList();
        return projectTagRepository.findByProjectIdIn(projectIds).stream()
                .collect(Collectors.groupingBy(
                        ProjectTag::getProjectId,
                        Collectors.mapping(ProjectTag::getTagId, Collectors.toList())
                ));
    }

    private Map<Long, String> fetchTagNameMap(Map<Long, List<Long>> projectTagMap) {
        List<Long> tagIds = projectTagMap.values().stream()
                .flatMap(Collection::stream)
                .distinct()
                .toList();
        return tagRepository.findAllById(tagIds).stream()
                .collect(Collectors.toMap(Tag::getId, Tag::getName));
    }

    private ProjectSummaryDto buildProjectSummaryDto(
            Project project,
            Map<Long, String> memberNameMap,
            Map<Long, List<Long>> projectTagMap,
            Map<Long, String> tagNameMap
    ){
        String memberName = memberNameMap.get(project.getMemberId());
        List<String> tagNames = projectTagMap.getOrDefault(project.getProjectId(), Collections.emptyList()).stream()
                .map(tagNameMap::get)
                .filter(Objects::nonNull)
                .toList();
        return ProjectDtoConverter.toSummaryDto(project, memberName, tagNames);
    }
}
