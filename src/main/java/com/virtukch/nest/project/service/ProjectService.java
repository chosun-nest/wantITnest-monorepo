package com.virtukch.nest.project.service;

import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.member.repository.MemberRepository;
import com.virtukch.nest.project.dto.ProjectRequestDTO;
import com.virtukch.nest.project.dto.ProjectResponseDTO;
import com.virtukch.nest.project.model.Project;
import com.virtukch.nest.project.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public Long createProject(ProjectRequestDTO dto) {
        Member leader = memberRepository.findById(dto.getProjectLeaderId())
                .orElseThrow(() -> new IllegalArgumentException("팀장을 찾을 수 없습니다."));

        Project project = new Project(
                leader,
                dto.getProjectTitle(),
                dto.getProjectDescription(),
                dto.getProjectStartDate(),
                dto.getProjectEndDate(),
                dto.getMaxMember()
        );

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
                        .isClosed(project.isClosed())
                        .maxMember(project.getMaxMember())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void closeProjectRecruitment(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("프로젝트를 찾을 수 없습니다."));
        project.closeRecruitment();
    }
}
