package com.virtukch.nest.project.service;

import com.virtukch.nest.comment.repository.CommentRepository;
import com.virtukch.nest.common.service.ImageService;
import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.member.repository.MemberRepository;
import com.virtukch.nest.project.dto.*;
import com.virtukch.nest.project.dto.converter.ProjectDtoConverter;
import com.virtukch.nest.project.exception.*;
import com.virtukch.nest.project.model.Project;
import com.virtukch.nest.project.repository.ProjectRepository;

import com.virtukch.nest.project_application.model.ProjectApplication;
import com.virtukch.nest.project_application.repository.ProjectApplicationRepository;
import com.virtukch.nest.project_member.model.ProjectMember;
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
    private final ProjectApplicationRepository projectApplicationRepository;
    private final MemberRepository memberRepository;
    private final ProjectMemberRepository projectMemberRepository; // ✅ 추가
    private final ProjectTagRepository projectTagRepository;
    private final TagService tagService;
    private final CommentRepository commentRepository;
    private final TagRepository tagRepository;
    private final ImageService imageService;
    private final String prefix = "project";

    @Transactional
    public ProjectResponseDto createProject(Long memberId, ProjectRequestDto requestDto) {
        String projectTitle = requestDto.getProjectTitle();
        log.info("[프로젝트 모집글 작성 시작] title={}, memberId={}", projectTitle, memberId);

        Project project = projectRepository.save(Project.createProject(memberId, projectTitle, requestDto.getProjectDescription()));

        saveProjectTags(project, requestDto.getTags());

        if (requestDto.getPartCounts() != null && !requestDto.getPartCounts().isEmpty()) {
            Member creator = memberRepository.findById(memberId)
                    .orElseThrow(() -> new RuntimeException("Member not found"));
            createProjectMembers(project.getProjectId(), creator.getMemberId(),
                    requestDto.getPartCounts(), requestDto.getCreatorPart(), requestDto.getCreatorRole());
        }

        // builder 내부에서 LEADER 자동 등록됨
        return ProjectDtoConverter.toCreateResponseDto(project);
    }

    @Transactional
    public ProjectResponseDto createProject(Long memberId, ProjectWithImagesRequestDto requestDto) {
        String title = requestDto.getProjectTitle();
        log.info("[모집글 생성 시작] title={}, memberId={}", title, memberId);
        Project project = projectRepository.save(Project.createProject(memberId, title, requestDto.getProjectDescription()));

        saveProjectTags(project, requestDto.getTags());

        if (requestDto.getPartCounts() != null && !requestDto.getPartCounts().isEmpty()) {
            Member creator = memberRepository.findById(memberId)
                    .orElseThrow(() -> new RuntimeException("Member not found"));
            createProjectMembers(project.getProjectId(), creator.getMemberId(),
                    requestDto.getPartCounts(), requestDto.getCreatorPart(), requestDto.getCreatorRole());
        }

        List<String> imageUrls;
        if (requestDto.getImages() != null && !requestDto.getImages().isEmpty()){
            imageUrls = imageService.uploadImages(requestDto.getImages(), prefix, project.getProjectId());
            project.updateProject(project.getProjectTitle(), project.getProjectDescription(), project.getIsRecruiting(), imageUrls);
         }

        log.info("[모집글 생성 완료] projectId={}", project.getProjectId());
        return ProjectDtoConverter.toCreateResponseDto(project);
    }

    @Transactional
    public ProjectDetailResponseDto getProjectDetail(Long projectId) {
        Project project = findByIdOrThrow(projectId);
        project.incrementViewCount();

        Member creator = findMemberOrThrow(project);
        List<String> tagNames = extractTagNames(projectId);

        List<ProjectMember> projectMembers = projectMemberRepository.findByProjectId(projectId);

        int currentNumberOfMembers = (int) projectMembers.stream().filter(pm -> pm.getMemberId() != null).count();
        int maximumNumberOfMembers = projectMembers.size();

        Map<Long, String> memberIdToName = projectMembers.stream()
                .map(ProjectMember::getMemberId)
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toMap(
                        id -> id,
                        id -> memberRepository.findById(id)
                                .map(Member::getMemberName)
                                .orElse("탈퇴한 사용자")
                ));
        Boolean isRecruiting = project.getIsRecruiting();

        return ProjectDtoConverter.toDetailResponseDto(
            project,
            creator,
            tagNames,
            projectMembers,
            memberIdToName,
            isRecruiting,
            currentNumberOfMembers,
            maximumNumberOfMembers
        );
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
                requestDto.getIsRecruiting());

        // Remove members if specified in requestDto before updating part counts
        if (requestDto.getMembersToRemove() != null && !requestDto.getMembersToRemove().isEmpty()) {
            removeProjectMembers(projectId, requestDto.getMembersToRemove());
        }

        // Update creator's part if creatorPart is present
        if (requestDto.getCreatorPart() != null) {
            ProjectMember.Part newPart = requestDto.getCreatorPart();
            ProjectMember creator = projectMemberRepository.findByProjectIdAndMemberId(projectId, memberId)
                .orElseThrow(CanNotRemoveCreatorException::new);
            creator.setPart(newPart);
            projectMemberRepository.save(creator);
        }

        projectTagRepository.deleteAllByProjectId(projectId);

        saveProjectTags(project, requestDto.getTags());

        if (requestDto.getPartCounts() != null && !requestDto.getPartCounts().isEmpty()) {
            updatePartCounts(projectId, requestDto.getPartCounts());
        }

        return ProjectDtoConverter.toUpdateResponseDto(project);
    }

    @Transactional
    public ProjectResponseDto updateProject(Long projectId, Long memberId, ProjectWithImagesRequestDto requestDto){
        Project project = validateProjectOwnershipAndGet(projectId, memberId);

        List<String> imageUrls = imageService.replaceImages(requestDto.getImages(), prefix, projectId, project.getImageUrlList());
        project.updateProject(project.getProjectTitle(), project.getProjectDescription(),
                project.getIsRecruiting(), imageUrls);

        // Remove members if specified in requestDto before updating part counts
        if (requestDto.getMembersToRemove() != null && !requestDto.getMembersToRemove().isEmpty()) {
            removeProjectMembers(projectId, requestDto.getMembersToRemove());
        }

        // Update creator's part if creatorPart is present
        if (requestDto.getCreatorPart() != null) {
            ProjectMember.Part newPart = requestDto.getCreatorPart();
            ProjectMember creator = projectMemberRepository.findByProjectIdAndMemberId(projectId, memberId)
                .orElseThrow(CanNotRemoveCreatorException::new);
            creator.setPart(newPart);
            projectMemberRepository.save(creator);
        }

        projectTagRepository.deleteAllByProjectId(project.getProjectId());
        saveProjectTags(project, requestDto.getTags());

        if (requestDto.getPartCounts() != null && !requestDto.getPartCounts().isEmpty()) {
            updatePartCounts(projectId, requestDto.getPartCounts());
        }

        return ProjectDtoConverter.toUpdateResponseDto(project);
    }

    @Transactional
    public void updatePartCounts(Long projectId, Map<ProjectMember.Part, Integer> partCounts) {
        for (Map.Entry<ProjectMember.Part, Integer> entry : partCounts.entrySet()) {
            ProjectMember.Part part = entry.getKey();
            int targetCount = entry.getValue();

            List<ProjectMember> members = projectMemberRepository.findByProjectIdAndPart(projectId, part);
            // Separate filled and vacant slots
            List<ProjectMember> filled = members.stream()
                    .filter(pm -> pm.getMemberId() != null)
                    .toList();
            List<ProjectMember> vacant = members.stream()
                    .filter(pm -> pm.getMemberId() == null)
                    .toList();
            int filledCount = filled.size();
            int vacantCount = vacant.size();
            int totalCount = filledCount + vacantCount;

            if (targetCount < filledCount) {
                throw new ProjectMemberRemoveException(part, filledCount, targetCount);
            }

            int toAdd = targetCount - totalCount;
            if (toAdd > 0) {
                // Add new vacant slots
                for (int i = 0; i < toAdd; i++) {
                    projectMemberRepository.save(ProjectMember.builder()
                            .projectId(projectId)
                            .part(part)
                            .role(ProjectMember.Role.MEMBER)
                            .build());
                }
            } else if (toAdd < 0) {
                // Remove up to -toAdd vacant (memberId == null) slots only
                int toRemove = -toAdd;
                // Only remove vacant slots, never filled
                if (toRemove > 0 && vacantCount > 0) {
                    List<ProjectMember> toDelete = vacant.stream().limit(toRemove).toList();
                    projectMemberRepository.deleteAll(toDelete);
                }
                // If not enough vacant slots, do not remove filled slots
            }
            // If toAdd == 0, nothing to do
        }
    }

    @Transactional
    public void removeProjectMembers(Long projectId, List<Long> memberIds) {
        for (Long memberId : memberIds) {
            ProjectMember member = projectMemberRepository.findByProjectIdAndMemberId(projectId, memberId)
                    .orElseThrow(() -> new ProjectMemberNotFoundException(projectId, memberId));
            member.removeMember();
            projectMemberRepository.save(member);
            // Update application status to CANCELLED if exists
            projectApplicationRepository.findByProjectIdAndMemberIdAndStatus(
                    projectId,
                    memberId,
                    ProjectApplication.ApplicationStatus.ACCEPTED
            ).ifPresent(application -> {
                application.updateStatus(ProjectApplication.ApplicationStatus.CANCELLED);
                projectApplicationRepository.save(application);
            });
        }
    }

    @Transactional
    public ProjectResponseDto deleteProject(Long projectId, Long memberId) {
        Project project = validateProjectOwnershipAndGet(projectId, memberId);

        projectTagRepository.deleteAllByProjectId(projectId);
        commentRepository.deleteAllByPostId(projectId);
        projectRepository.delete(project);
        return ProjectDtoConverter.toDeleteResponseDto(project);
    }

    @Transactional(readOnly = true)
    public com.virtukch.nest.project.model.Project findByIdOrThrow(Long projectId) {
        return projectRepository.findById(projectId).orElseThrow(() -> new ProjectNotFoundException(projectId));
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

        if (keyword == null || keyword.trim().isEmpty()) {
            projectPage = projectRepository.findAll(pageable);
            return buildProjectListResponse(projectPage);
        }

        switch (searchType.toUpperCase()) {
            case "TITLE" -> projectPage = projectRepository.searchByProjectTitle(keyword, pageable);
            case "CONTENT" -> projectPage = projectRepository.searchByProjectDescriptionContaining(keyword, pageable);
            default -> {
                List<Long> titleIds = projectRepository.findIdsByProjectTitle(keyword);
                List<Long> descriptionIds = projectRepository.findIdsByProjectDescription(keyword);

                if (titleIds.isEmpty() && descriptionIds.isEmpty()) {
                    return buildProjectListResponse(Page.empty(pageable));
                }

                projectPage = projectRepository.searchByProjectTitleOrProjectDescriptionInIds(
                        titleIds, keyword, descriptionIds, keyword, pageable);
            }
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
                    .searchByProjectIdAndTitle(projectIds, keyword, pageable);
            case "CONTENT" -> projectPage = projectRepository
                    .searchByProjectIdAndDescription(projectIds, keyword, pageable);
            default -> projectPage = projectRepository
                    .searchByProjectIdAndTitleOrDescription(projectIds, keyword, projectIds, keyword, pageable);
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
        Map<Long, Long> commentCountMap = fetchCommentCountMap(projects);

        List<ProjectSummaryDto> summaries = projects.stream()
                .map(project -> buildProjectSummaryDto(project, memberNameMap, projectTagMap, tagNameMap, commentCountMap))
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
            Map<Long, String> tagNameMap,
            Map<Long, Long> commentCountMap
    ){
        String memberName = memberNameMap.get(project.getMemberId());
        List<String> tagNames = projectTagMap.getOrDefault(project.getProjectId(), Collections.emptyList()).stream()
                .map(tagNameMap::get)
                .filter(Objects::nonNull)
                .toList();
        Long commentCount = commentCountMap.getOrDefault(project.getProjectId(), 0L);

        String imageUrl = null;
        List<String> imageUrlList = project.getImageUrlList();
        if (imageUrlList != null && !imageUrlList.isEmpty()) {
            imageUrl = imageUrlList.get(0);
        }

        Boolean isRecruiting = project.getIsRecruiting();

        // Calculate current and maximum number of members
        List<ProjectMember> members = projectMemberRepository.findByProjectId(project.getProjectId());
        int currentNumberOfMembers = (int) members.stream().filter(pm -> pm.getMemberId() != null).count();
        int maximumNumberOfMembers = members.size();

        return ProjectDtoConverter.toSummaryDto(project, memberName, tagNames, commentCount, imageUrl, isRecruiting, currentNumberOfMembers, maximumNumberOfMembers);
    }

    private Map<Long, Long> fetchCommentCountMap(List<Project> projects) {
        List<Long> projectIds = projects.stream().map(Project::getProjectId).toList();

        if (projectIds.isEmpty()) {
            return Collections.emptyMap();
        }

        return commentRepository.countByPostIdIn(projectIds).stream()
                .collect(Collectors.toMap(
                        result -> (Long) result[0], // projectId
                        result -> (Long) result[1]  // count
                ));
    }

    // 프로젝트 멤버 생성
    public void createProjectMembers(Long projectId, Long creatorId,
                                     Map<ProjectMember.Part, Integer> partCounts,
                                     ProjectMember.Part creatorPart,
                                     ProjectMember.Role creatorRole) {
        List<ProjectMember> slots = new ArrayList<>();
        boolean assignedCreator = false;

        for (Map.Entry<ProjectMember.Part, Integer> entry : partCounts.entrySet()) {
            ProjectMember.Part part = entry.getKey();
            int count = entry.getValue();
            for (int i = 0; i < count; i++) {
                ProjectMember.ProjectMemberBuilder builder = ProjectMember.builder()
                        .projectId(projectId)
                        .part(part)
                        .role(ProjectMember.Role.MEMBER);

                if (!assignedCreator && part == creatorPart) {
                    builder.memberId(creatorId);
                    builder.role(creatorRole);
                    assignedCreator = true;
                }

                slots.add(builder.build());
            }
        }
        projectMemberRepository.saveAll(slots);
    }
}
