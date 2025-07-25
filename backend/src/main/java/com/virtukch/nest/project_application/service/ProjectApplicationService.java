package com.virtukch.nest.project_application.service;

import com.virtukch.nest.common.model.BaseTimeEntity;
import com.virtukch.nest.project_application.exception.ProjectNotFoundException;
import com.virtukch.nest.project_application.dto.converter.ProjectApplicationDtoConverter;
import com.virtukch.nest.project_application.exception.*;
import com.virtukch.nest.project.model.enums.ApplicationStatus;
import com.virtukch.nest.project.model.ProjectApplication;
import com.virtukch.nest.project_application.repository.ProjectApplicationRepository;
import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.member.repository.MemberRepository;
import com.virtukch.nest.project.repository.ProjectRepository;
import com.virtukch.nest.project.model.ProjectParticipant;
import com.virtukch.nest.project_participant.repository.ProjectParticipantRepository;
import com.virtukch.nest.project_application.exception.AlreadyProcessedApplicationException;
import com.virtukch.nest.project.model.Project;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class ProjectApplicationService extends BaseTimeEntity {

    private final ProjectApplicationRepository projectApplicationRepository;
    private final MemberRepository memberRepository;
    private final ProjectRepository projectRepository;
    private final ProjectParticipantRepository projectMemberRepository;

    @Transactional
    public ProjectApplicationResponseDto applyToProject(Long projectId, Long memberId, ProjectApplicationRequestDto requestDto) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException(projectId));

        if (project.getMemberId().equals(memberId)) {
            throw new ProjectOwnerCannotApplyException(); // 또는 IllegalStateException
        }

        projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException(projectId));

        // 중복 지원 방지 (REJECTED 또는 CANCELLED 제외)
        if (projectApplicationRepository.existsByProjectIdAndMemberIdAndStatusNotIn(
                projectId,
                memberId,
                List.of(ApplicationStatus.REJECTED, ApplicationStatus.CANCELED))) {
            throw new DuplicateApplicationException();
        }

        ProjectApplication application = ProjectApplication.builder()
                .projectId(projectId)
                .memberId(memberId)
                .part(requestDto.getPart())
                .status(ApplicationStatus.PENDING)
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
        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new AlreadyProcessedApplicationException();
        }

        // 현재 ACCEPTED 상태의 인원 수 조회
        long acceptedCount = projectApplicationRepository.countByProjectIdAndStatus(
                projectId, ApplicationStatus.ACCEPTED);

        // 프로젝트 최대 인원 수를 동적으로 계산
        int maxMember = projectMemberRepository.findByProjectId(projectId).size();

        if (acceptedCount >= maxMember) {
            throw new ProjectFullException("프로젝트 모집 인원을 초과하여 승인할 수 없습니다.");
        }

        application.setStatus(ApplicationStatus.ACCEPTED);
        projectApplicationRepository.save(application);

        List<ProjectParticipant> vacantList = projectMemberRepository
                .findByProjectIdAndPartAndMemberIdIsNull(projectId, application.getPart());

        if (!vacantList.isEmpty()) {
            ProjectParticipant vacant = vacantList.get(0);
            vacant.setParticipantId(application.getMemberId());
            projectMemberRepository.save(vacant);
        } else {
            // 파트별 모집 인원 초과 방지
            long maxCount = projectMemberRepository.countByProjectIdAndPart(projectId, application.getPart());
            long approvedCount = projectMemberRepository.countByProjectIdAndPartAndMemberIdIsNotNull(projectId, application.getPart());
            if (approvedCount >= maxCount) {
                throw new ProjectFullException(application.getPart() + " 파트의 모집 인원을 초과할 수 없습니다.");
            }
            projectMemberRepository.save(ProjectParticipant.builder()
                    .projectId(projectId)
                    .memberId(application.getMemberId())
                    .role(ProjectParticipant.Role.MEMBER)
                    .part(application.getPart())
                    .build());
        }

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException(projectId));

        int registeredCount = projectMemberRepository
                .findByProjectIdAndMemberIdIsNotNull(projectId)
                .size();

        if (registeredCount >= maxMember) {
            project.setIsRecruiting(false);
            projectRepository.save(project);
        }

        Member member = memberRepository.findById(application.getMemberId()).orElse(null);
        return ProjectApplicationDtoConverter.toResponseDto(application, member != null ? member.getMemberName() : "알 수 없음");
    }

    @Transactional
    public ProjectApplicationResponseDto rejectApplication(Long projectId, Long applicationId, Long requesterId) {
        ProjectApplication application = projectApplicationRepository.findById(applicationId)
                .orElseThrow(ApplicationNotFoundException::new);
        validateOwnership(projectId, requesterId, application);
        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new AlreadyProcessedApplicationException();
        }

        application.setStatus(ApplicationStatus.REJECTED);
        projectApplicationRepository.save(application);

        Member member = memberRepository.findById(application.getMemberId()).orElse(null);
        return ProjectApplicationDtoConverter.toResponseDto(application, member != null ? member.getMemberName() : "알 수 없음");
    }

    private void validateOwnership(Long projectId, Long requesterId, ProjectApplication application) {
        if (!application.getProjectId().equals(projectId)) {
            throw new ApplicationNotFoundException();
        }

        Long writerId = projectRepository.searchWriterIdByProjectId(projectId)
                .orElseThrow(() -> new ProjectNotFoundException(projectId));

        if (!writerId.equals(requesterId)) {
            throw new NotProjectOwnerException();
        }
    }
}
