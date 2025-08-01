package com.virtukch.nest.project.service;

import com.virtukch.nest.comment.model.BoardType;
import com.virtukch.nest.comment.repository.CommentRepository;
import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.member.service.MemberService;
import com.virtukch.nest.project.dto.converter.ProjectDtoConverter;
import com.virtukch.nest.project.dto.request.ProjectCreateRequestDto;
import com.virtukch.nest.project.dto.request.ProjectStatusUpdateRequestDto;
import com.virtukch.nest.project.dto.request.ProjectUpdateRequestDto;
import com.virtukch.nest.project.dto.request.RoleCreateRequestDto;
import com.virtukch.nest.project.dto.response.ProjectDetailResponseDto;
import com.virtukch.nest.project.dto.response.ProjectListResponseDto;
import com.virtukch.nest.project.dto.response.ProjectResponseDto;
import com.virtukch.nest.project.dto.response.ProjectSummaryDto;
import com.virtukch.nest.project.exception.ProjectErrorCode;
import com.virtukch.nest.project.exception.ProjectException;
import com.virtukch.nest.project.model.Project;
import com.virtukch.nest.project.model.ProjectParticipant;
import com.virtukch.nest.project.model.ProjectRole;
import com.virtukch.nest.project.model.ProjectTag;
import com.virtukch.nest.project.model.enums.ParticipantStatus;
import com.virtukch.nest.project.model.enums.Position;
import com.virtukch.nest.project.model.enums.ProjectStatus;
import com.virtukch.nest.project.repository.ProjectParticipantRepository;
import com.virtukch.nest.project.repository.ProjectRepository;
import com.virtukch.nest.project.repository.ProjectTagRepository;
import com.virtukch.nest.tag.model.Tag;
import com.virtukch.nest.tag.repository.TagRepository;
import com.virtukch.nest.tag.service.TagService;
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
    private final TagService tagService;
    private final CommentRepository commentRepository;
    private final MemberService memberService;
    private final ProjectTagRepository projectTagRepository;

    @Transactional
    public ProjectResponseDto createProject(Long memberId, ProjectCreateRequestDto requestDto) {
        String projectTitle = requestDto.getProjectTitle();
        log.info("[프로젝트 모집글 작성 시작] title={}, memberId={}", projectTitle, memberId);

        // projectId가 필요하므로 먼저 저장
        Member member = memberService.findByIdOrThrow(memberId);

        int totalMemberNeeded = requestDto.getRoles().stream()
                .mapToInt(RoleCreateRequestDto::getRequiredCount)
                .sum();

        Project project = projectRepository.save(Project.create(
                member,
                requestDto.getProjectTitle(),
                requestDto.getProjectDescription(),
                totalMemberNeeded,
                requestDto.getRecruitmentEndDate(),
                requestDto.getProjectStartDate(),
                requestDto.getProjectEndDate())
        );

        List<RoleCreateRequestDto> roleCreateRequestDtos = requestDto.getRoles();
        roleCreateRequestDtos.forEach(roleDto -> {
            ProjectRole projectRole = ProjectRole.create(
                    roleDto.getRoleName(),
                    roleDto.getRoleDescription(),
                    roleDto.getAdditionalRequirements(),
                    roleDto.getRequiredCount());
            project.addRole(projectRole);
        });

        List<Tag> tags = tagRepository.findByNameIn(requestDto.getTags());
        tags.forEach(tag -> {
            ProjectTag projectTag = ProjectTag.create(project, tag);
            project.addTag(projectTag);
        });
        
        ProjectRole creatorRole = project.getRoles().get(requestDto.getCreatorRoleIndex());
        creatorRole.increaseCurrentCount();

        ProjectParticipant participant = ProjectParticipant.create(member, creatorRole, Position.LEADER);
        project.addParticipant(participant); // 프로젝트 글 작성자가 LEADER

        return ProjectDtoConverter.toCreateResponseDto(project);
    }

    @Transactional(readOnly = true)
    public ProjectListResponseDto getProjectList(List<String> tagNames, ProjectStatus status, Pageable pageable) {
        // DELETED 상태 프로젝트는 일반 조회에서 제외
        if (status == ProjectStatus.DELETED) {
            throw new ProjectException(ProjectErrorCode.INVALID_STATUS_VALUE);
        }
        
        Page<Project> projectPage;
        
        boolean hasTagFilter = tagNames != null && !tagNames.isEmpty();
        boolean hasStatusFilter = status != null;
        
        if (hasTagFilter && hasStatusFilter) {
            // 태그와 상태 모두 필터링
            List<Tag> tags = tagRepository.findByNameIn(tagNames);
            if (tags.isEmpty()) {
                // 존재하지 않는 태그들로만 검색한 경우 빈 결과 반환
                return ProjectDtoConverter.toProjectListResponseDto(Collections.emptyList(), Page.empty(pageable));
            }
            List<ProjectTag> projectTags = projectTagRepository.findByTagIn(tags);
            projectPage = projectRepository.findByTagsAndStatus(projectTags, status, pageable);
        } else if (hasTagFilter) {
            // 태그만 필터링
            List<Tag> tags = tagRepository.findByNameIn(tagNames);
            if (tags.isEmpty()) {
                // 존재하지 않는 태그들로만 검색한 경우 빈 결과 반환
                return ProjectDtoConverter.toProjectListResponseDto(Collections.emptyList(), Page.empty(pageable));
            }
            List<ProjectTag> projectTags = projectTagRepository.findByTagIn(tags);
            projectPage = projectRepository.findByTags(projectTags, pageable);
        } else if (hasStatusFilter) {
            // 상태만 필터링
            projectPage = projectRepository.findByStatus(status, pageable);
        } else {
            // 필터링 없음 - 전체 조회 (DELETED 제외)
            projectPage = projectRepository.findByStatusNot(ProjectStatus.DELETED, pageable);
        }
        
        return buildListResponseDto(projectPage);
    }

    @Transactional(readOnly = true)
    public ProjectListResponseDto getMyProjectList(Long memberId, Pageable pageable) {
        Member member = memberService.findByIdOrThrow(memberId);
        Page<Project> projectPage = projectRepository.findByMemberAndStatusNot(member, ProjectStatus.DELETED, pageable);
        return buildListResponseDto(projectPage);
    }

    @Transactional(readOnly = true)
    public ProjectListResponseDto getParticipatingProjectList(Long memberId, Pageable pageable) {
        Member member = memberService.findByIdOrThrow(memberId);
        Page<Project> projectPage = projectRepository.findByParticipantMemberAndStatusExcludeDeleted(member, ParticipantStatus.ACTIVE, pageable);
        return buildListResponseDto(projectPage);
    }

    @Transactional
    public ProjectResponseDto updateProject(Long projectId, Long memberId, ProjectUpdateRequestDto requestDto) {
        Project project = validateProjectOwnershipAndGet(projectId, memberId);

        List<Tag> tags = tagRepository.findByNameIn(requestDto.getTagNames());
        List<ProjectTag> projectTags = projectTagRepository.findByTagIn(tags);

        if (projectTags.isEmpty()) {
            Tag tag = tagService.findByNameOrThrow("UNCATEGORIZED");
            projectTags.add(ProjectTag.create(project, tag));
        }

        project.updateProject(requestDto, projectTags);

        return ProjectDtoConverter.toUpdateResponseDto(project);
    }

    @Transactional(readOnly = true)
    public ProjectDetailResponseDto getProjectDetail(Long projectId) {
        Project project = findByIdWithRolesAndParticipantsOrThrow(projectId);
        
        // DELETED 상태 프로젝트는 조회 불가
        if (project.getStatus() == ProjectStatus.DELETED) {
            throw new ProjectException(ProjectErrorCode.PROJECT_NOT_FOUND);
        }
        
        List<String> tagNames = projectTagRepository.findTagNamesByProjectId(projectId);
        return ProjectDtoConverter.toDetailResponseDto(project, tagNames);
    }

    @Transactional
    public ProjectResponseDto deleteProject(Long projectId, Long memberId) {
        // 삭제의 경우 DELETED 상태 체크를 별도로 처리
        Project project = findByIdOrThrow(projectId);
        
        if(!project.getMember().getMemberId().equals(memberId)) {
            throw new ProjectException(ProjectErrorCode.NO_PROJECT_AUTHORITY);
        }
        
        // 이미 삭제된 프로젝트인지 확인
        if (project.getStatus() == ProjectStatus.DELETED) {
            throw new ProjectException(ProjectErrorCode.PROJECT_NOT_FOUND);
        }
        
        // Soft delete: 상태를 DELETED로 변경
        project.updateStatus(ProjectStatus.DELETED);
        
        return ProjectDtoConverter.toDeleteResponseDto(project);
    }

    @Transactional
    public void updateProjectStatus(Long projectId, Long memberId, ProjectStatusUpdateRequestDto requestDto) {
        Project project = validateProjectOwnershipAndGet(projectId, memberId);
        ProjectStatus newStatus = requestDto.getStatus();

        // 1. 입력값 검증
        if (newStatus == null) {
            throw new ProjectException(ProjectErrorCode.INVALID_STATUS_VALUE);
        }

        // 2. 상태 전환 유효성 검증
        validateStatusTransition(project.getStatus(), newStatus);

        project.updateStatus(newStatus);
    }

    /**
     * 상태 전환 유효성 검증
     * 논리적으로 가능한 상태 전환인지 확인
     */
    private void validateStatusTransition(ProjectStatus currentStatus, ProjectStatus newStatus) {
        // 같은 상태로의 전환은 허용 (멱등성 보장)
        if (currentStatus == newStatus) {
            return;
        }

        switch (currentStatus) {
            case RECRUITING:
                // 모집 중 → 모집 종료, 삭제만 가능
                if (newStatus != ProjectStatus.CLOSED && newStatus != ProjectStatus.DELETED) {
                    throw new ProjectException(ProjectErrorCode.INVALID_STATUS_TRANSITION);
                }
                break;

            case CLOSED:
                // 모집 종료 → 진행 중, 재모집, 삭제 가능
                if (newStatus != ProjectStatus.IN_PROGRESS &&
                        newStatus != ProjectStatus.RECRUITING &&
                        newStatus != ProjectStatus.DELETED) {
                    throw new ProjectException(ProjectErrorCode.INVALID_STATUS_TRANSITION);
                }
                break;

            case IN_PROGRESS:
                // 진행 중 → 완료, 재모집(재시작), 삭제 가능
                if (newStatus != ProjectStatus.COMPLETED &&
                        newStatus != ProjectStatus.RECRUITING &&
                        newStatus != ProjectStatus.DELETED) {
                    throw new ProjectException(ProjectErrorCode.INVALID_STATUS_TRANSITION);
                }
                break;

            case COMPLETED:
                // 완료 → 삭제만 가능
                if (newStatus != ProjectStatus.DELETED) {
                    throw new ProjectException(ProjectErrorCode.INVALID_STATUS_TRANSITION);
                }
                break;

            case DELETED:
                // 삭제된 프로젝트는 어떤 상태로도 전환 불가
                throw new ProjectException(ProjectErrorCode.INVALID_STATUS_TRANSITION);

            default:
                throw new IllegalStateException("알 수 없는 프로젝트 상태: " + currentStatus);
        }
    }

    private ProjectListResponseDto buildListResponseDto(Page<Project> projectPage) {
        List<Project> projects = projectPage.getContent();
        Map<Long, Long> commentCountMap = fetchCommentCountMap(projects);

        List<ProjectSummaryDto> summaries = projects.stream().map(project -> ProjectDtoConverter.toSummaryDto(
                project,
                project.getTags().stream()
                        .map(projectTag -> projectTag.getTag().getName())
                        .toList(),
                commentCountMap.getOrDefault(project.getId(), 0L)
        )).toList();

        return ProjectDtoConverter.toProjectListResponseDto(summaries, projectPage);
    }

    private Map<Long, Long> fetchCommentCountMap(List<Project> projects) {
        List<Long> projectIds = projects.stream().map(Project::getId).toList();

        if (projectIds.isEmpty()) {
            return Collections.emptyMap();
        }

        return commentRepository.countByPostIdIn(BoardType.PROJECT, projectIds).stream()
                .collect(Collectors.toMap(
                        result -> (Long) result[0],  // articleId
                        result -> (Long) result[1]   // count
                ));
    }

    private Project validateProjectOwnershipAndGet(Long projectId, Long memberId) {
        Project project = findByIdOrThrow(projectId);
        
        // DELETED 상태 프로젝트는 접근 불가 (삭제 API 제외)
        if (project.getStatus() == ProjectStatus.DELETED) {
            throw new ProjectException(ProjectErrorCode.PROJECT_NOT_FOUND);
        }
        
        if(!project.getMember().getMemberId().equals(memberId)) {
            throw new ProjectException(ProjectErrorCode.NO_PROJECT_AUTHORITY);
        }
        return project;
    }

    public Project findByIdOrThrow(Long projectId) {
        return projectRepository.findById(projectId).orElseThrow(() -> new ProjectException(ProjectErrorCode.PROJECT_NOT_FOUND));
    }

    public Project findByIdWithRolesAndParticipantsOrThrow(Long projectId) {
        return projectRepository.findByIdWithRolesAndParticipants(projectId)
                .orElseThrow(() -> new ProjectException(ProjectErrorCode.PROJECT_NOT_FOUND));
    }
}
