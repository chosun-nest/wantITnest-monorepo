package com.virtukch.nest.project_application.service;

import com.virtukch.nest.project.exception.ProjectNotFoundException;
import com.virtukch.nest.project_application.dto.ProjectApplicationRequestDto;
import com.virtukch.nest.project_application.dto.ProjectApplicationResponseDto;
import com.virtukch.nest.project_application.dto.converter.ProjectApplicationDtoConverter;
import com.virtukch.nest.project_application.exception.*;
import com.virtukch.nest.project_application.model.ProjectApplication;
import com.virtukch.nest.project_application.repository.ProjectApplicationRepository;
import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.member.repository.MemberRepository;
import com.virtukch.nest.project.repository.ProjectRepository;
import com.virtukch.nest.project_member.model.ProjectMember;
import com.virtukch.nest.project_member.repository.ProjectMemberRepository;
import com.virtukch.nest.project_application.exception.AlreadyProcessedApplicationException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class ProjectApplicationService {

    private final ProjectApplicationRepository projectApplicationRepository;
    private final MemberRepository memberRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;

    @Transactional
    public ProjectApplicationResponseDto applyToProject(Long projectId, Long memberId, ProjectApplicationRequestDto requestDto) {
        // 중복 지원 방지
        if (projectApplicationRepository.findByProjectIdAndMemberIdAndPart(projectId, memberId, requestDto.getPart()).isPresent()) {
            throw new DuplicateApplicationException();
        }

        ProjectApplication application = ProjectApplication.builder()
                .projectId(projectId)
                .memberId(memberId)
                .part(requestDto.getPart())
                .status(ProjectApplication.ApplicationStatus.WAITING)
                .appliedAt(LocalDateTime.now())
                .build();

        projectApplicationRepository.save(application);

        Member member = memberRepository.findById(memberId).orElse(null);

        return ProjectApplicationDtoConverter.toResponseDto(application, member != null ? member.getMemberName() : "알 수 없음");
    }

    @Transactional
    public List<ProjectApplicationResponseDto> getApplicationsByProject(Long projectId) {
        List<ProjectApplication> applications = projectApplicationRepository.findByProjectId(projectId);

        return applications.stream().map(app -> {
            Member member = memberRepository.findById(app.getMemberId()).orElse(null);
            return ProjectApplicationDtoConverter.toResponseDto(app, member != null ? member.getMemberName() : "알 수 없음");
        }).toList();
    }

    @Transactional
    public ProjectApplicationResponseDto acceptApplication(Long projectId, Long applicationId, Long requesterId) {
        ProjectApplication application = projectApplicationRepository.findById(applicationId)
                .orElseThrow(ApplicationNotFoundException::new);
        validateOwnership(projectId, requesterId, application);
        if (application.getStatus() != ProjectApplication.ApplicationStatus.WAITING) {
            throw new AlreadyProcessedApplicationException();
        }

        // 현재 ACCEPTED 상태의 인원 수 조회
        long acceptedCount = projectApplicationRepository.countByProjectIdAndStatus(
                projectId, ProjectApplication.ApplicationStatus.ACCEPTED);

        // 프로젝트 최대 인원 수 확인
        int maxMember = projectRepository.findById(projectId)
                .orElseThrow(ApplicationNotFoundException::new)
                .getMaxMember();

        if (acceptedCount >= maxMember) {
            throw new ProjectFullException();
        }

        application.setStatus(ProjectApplication.ApplicationStatus.ACCEPTED);
        projectApplicationRepository.save(application);

        projectMemberRepository.save(ProjectMember.builder()
                .projectId(projectId)
                .memberId(application.getMemberId())
                .role(ProjectMember.Role.MEMBER)
                .part(application.getPart())
                .isApproved(true)
                .build());

        Member member = memberRepository.findById(application.getMemberId()).orElse(null);
        return ProjectApplicationDtoConverter.toResponseDto(application, member != null ? member.getMemberName() : "알 수 없음");
    }

    @Transactional
    public ProjectApplicationResponseDto rejectApplication(Long projectId, Long applicationId, Long requesterId) {
        ProjectApplication application = projectApplicationRepository.findById(applicationId)
                .orElseThrow(ApplicationNotFoundException::new);
        validateOwnership(projectId, requesterId, application);
        if (application.getStatus() != ProjectApplication.ApplicationStatus.WAITING) {
            throw new AlreadyProcessedApplicationException();
        }

        application.setStatus(ProjectApplication.ApplicationStatus.REJECTED);
        projectApplicationRepository.save(application);

        Member member = memberRepository.findById(application.getMemberId()).orElse(null);
        return ProjectApplicationDtoConverter.toResponseDto(application, member != null ? member.getMemberName() : "알 수 없음");
    }

    private void validateOwnership(Long projectId, Long requesterId, ProjectApplication application) {
        if (!application.getProjectId().equals(projectId)) {
            throw new ApplicationNotFoundException();
        }

        Long writerId = projectRepository.findWriterIdByProjectId(projectId)
                .orElseThrow(() -> new ProjectNotFoundException(projectId));

        if (!writerId.equals(requesterId)) {
            throw new NotProjectOwnerException();
        }
    }
}
