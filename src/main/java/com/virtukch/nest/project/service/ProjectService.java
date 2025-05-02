package com.virtukch.nest.project.service;

import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.member.repository.MemberRepository;
import com.virtukch.nest.project.dto.ProjectRequestDTO;
import com.virtukch.nest.project.dto.ProjectResponseDTO;
import com.virtukch.nest.project.dto.ProjectUpdateRequestDTO;
import com.virtukch.nest.project.exception.NoProjectAuthorityException;
import com.virtukch.nest.project.exception.ProjectNotFoundException;
import com.virtukch.nest.project.model.Project;
import com.virtukch.nest.project.repository.ProjectRepository;
import com.virtukch.nest.project_member.model.ProjectMember;
import com.virtukch.nest.project_member.repository.ProjectMemberRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final MemberRepository memberRepository;
    private final ProjectMemberRepository projectMemberRepository; // ✅ 추가

    @Transactional
    public Long createProject(ProjectRequestDTO dto, Long memberId) {
        Member leader = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("리더 멤버가 존재하지 않습니다"));

        Project project = Project.createProject(
                dto.getProjectTitle(),
                dto.getProjectDescription(),
                leader,
                dto.getMaxMember(),
                dto.getProjectStartDate(),
                dto.getProjectEndDate()
        );

        // builder 내부에서 LEADER 자동 등록됨
        return projectRepository.save(project).getProjectId();
    }

    @Transactional(readOnly = true)
    public List<ProjectResponseDTO> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(project -> ProjectResponseDTO.builder()
                        .projectId(project.getProjectId())
                        .projectTitle(project.getProjectTitle())
                        .projectDescription(project.getProjectDescription())
                        .projectStartDate(project.getProjectStartDate())
                        .projectEndDate(project.getProjectEndDate())
                        .isClosed(project.isRecruiting())
                        .maxMember(project.getMaxMember())
                        .projectLeaderId(getProjectLeaderId(project))
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateProject(Long projectId, Long memberId, ProjectUpdateRequestDTO requestDTO) throws AccessDeniedException {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException(projectId));

        ProjectMember projectMember = projectMemberRepository
                .findByProject_ProjectIdAndMember_MemberId(projectId, memberId)
                .orElseThrow(() -> new AccessDeniedException("프로젝트에 속하지 않은 사용자입니다."));

        if (projectMember.getRole() != ProjectMember.Role.LEADER) {
            throw new AccessDeniedException("프로젝트 리더만 수정할 수 있습니다.");
        }

        project.updateProject(requestDTO);
    }

    private Long getProjectLeaderId(Project project) {
        return Optional.ofNullable(project.getProjectLeader())
                       .map(Member::getMemberId)
                       .orElse(null);
    }

    @Transactional
    public void closeProjectRecruitment(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("프로젝트를 찾을 수 없습니다."));
        project.closeRecruitment();
    }

    @Transactional(readOnly = true)
    public Project findByIdOrThrow(Long projectId) {
        return projectRepository.findById(projectId).orElseThrow(() -> new ProjectNotFoundException(projectId));
    }

    @Transactional(readOnly = true)
    public Project findOwnedProjectOrThrow(Long projectId, Long memberId) {
        Project project = findByIdOrThrow(projectId);
        if(!Objects.equals(project.getProjectLeader(), memberId)) {
            throw new NoProjectAuthorityException(projectId, memberId);
        }
        return project;
    }
}
