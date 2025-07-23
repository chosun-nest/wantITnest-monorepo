package com.virtukch.nest.project.service;

import com.virtukch.nest.project.dto.converter.ProjectDtoConverter;
import com.virtukch.nest.project.dto.request.ProjectCreateRequestDto;
import com.virtukch.nest.project.dto.request.RoleCreateRequestDto;
import com.virtukch.nest.project.dto.response.ProjectCreateResponseDto;
import com.virtukch.nest.project.dto.response.ProjectListResponseDto;
import com.virtukch.nest.project.model.*;
import com.virtukch.nest.project.repository.ProjectRepository;
import com.virtukch.nest.tag.model.Tag;
import com.virtukch.nest.tag.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TagRepository tagRepository;

    private final String prefix = "project";

    @Transactional
    public ProjectCreateResponseDto createProject(Long memberId, ProjectCreateRequestDto requestDto) {
        String projectTitle = requestDto.getProjectTitle();
        log.info("[프로젝트 모집글 작성 시작] title={}, memberId={}", projectTitle, memberId);

        // projectId가 필요하므로 먼저 저장
        Project project = projectRepository.save(Project.createProject(memberId, requestDto));

        List<RoleCreateRequestDto> roles = requestDto.getRoles();
        roles.forEach(role -> {
            ProjectRole projectRole = ProjectRole.createProjectRole(role);
            project.addRole(projectRole);
        });

        List<Tag> tags = tagRepository.findAllByNameIn(requestDto.getTags());
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
        return ProjectDtoConverter.toProjectListResponseDto(projectPage);
    }
}
