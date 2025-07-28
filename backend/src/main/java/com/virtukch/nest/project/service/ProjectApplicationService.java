package com.virtukch.nest.project.service;

import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.member.service.MemberService;
import com.virtukch.nest.project.dto.converter.ApplicationDtoConverter;
import com.virtukch.nest.project.dto.request.ApplicationCreateRequestDto;
import com.virtukch.nest.project.dto.request.ApplicationUpdateRequestDto;
import com.virtukch.nest.project.dto.response.ApplicationListDto;
import com.virtukch.nest.project.dto.response.MyApplicationResponseDto;
import com.virtukch.nest.project.exception.ProjectException;
import com.virtukch.nest.project.exception.ProjectErrorCode;
import com.virtukch.nest.project.model.Project;
import com.virtukch.nest.project.model.ProjectApplication;
import com.virtukch.nest.project.model.enums.ApplicationStatus;
import com.virtukch.nest.project.model.enums.ProjectStatus;
import com.virtukch.nest.project.repository.ProjectApplicationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class ProjectApplicationService {

    private final ProjectApplicationRepository applicationRepository;
    private final MemberService memberService;
    private final ProjectRoleService projectRoleService;
    private final ProjectService projectService;

    @Transactional
    public void applyToProject(Long projectId, Long memberId, ApplicationCreateRequestDto requestDto) {

        Project project = projectService.findByIdOrThrow(projectId);
        Member member = memberService.findByIdOrThrow(memberId);

        if (project.getMember().getMemberId().equals(memberId)) {
            throw new ProjectException(ProjectErrorCode.PROJECT_OWNER_CANNOT_APPLY);
        }

        // 프로젝트 모집 상태 확인
        if (!project.getIsRecruiting() || !ProjectStatus.RECRUITING.equals(project.getStatus())) {
            throw new ProjectException(ProjectErrorCode.PROJECT_RECRUITMENT_CLOSED);
        }

        // 중복 지원 방지 (REJECTED 또는 CANCELLED 제외)
        if (applicationRepository.existsByProjectAndMemberAndStatusNotIn(
                project,
                member,
                List.of(ApplicationStatus.REJECTED, ApplicationStatus.CANCELED))) {
            throw new ProjectException(ProjectErrorCode.DUPLICATE_APPLICATION);
        }

        // 프로젝트 전체 정원 확인
        Long acceptedCount = applicationRepository.countByProjectAndStatus(project, ApplicationStatus.ACCEPTED);
        if (acceptedCount >= project.getTotalMemberNeeded()) {
            throw new ProjectException(ProjectErrorCode.PROJECT_CAPACITY_EXCEEDED);
        }

        // 지원하려는 역할의 정원 확인
        var projectRole = projectRoleService.findProjectRoleOrThrow(projectId, requestDto.getRoleId());
        if (projectRole.getCurrentCount() >= projectRole.getRequiredCount()) {
            throw new ProjectException(ProjectErrorCode.ROLE_CAPACITY_EXCEEDED);
        }

        ProjectApplication application = ProjectApplication.create(
                project,
                memberService.findByIdOrThrow(memberId),
                projectRole,
                requestDto.getApplicationMessage(),
                requestDto.getAvailableStartDate(),
                requestDto.getAvailableTimeSlots(),
                requestDto.getTimePreferenceNote()
        );

        applicationRepository.save(application);
    }

    @Transactional(readOnly = true)
    public List<MyApplicationResponseDto> getMyApplications(Long memberId) {
        Member member = memberService.findByIdOrThrow(memberId);
        List<ProjectApplication> applications = applicationRepository.findByMemberOrderByAppliedAtDesc(member);
        
        return applications.stream()
                .map(ApplicationDtoConverter::toMyApplicationDto)
                .toList();
    }

    @Transactional
    public MyApplicationResponseDto updateApplication(Long applicationId, Long memberId, ApplicationUpdateRequestDto requestDto) {
        ProjectApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ProjectException(ProjectErrorCode.APPLICATION_NOT_FOUND));

        // 본인의 지원서인지 확인
        if (!application.getMember().getMemberId().equals(memberId)) {
            throw new ProjectException(ProjectErrorCode.UNAUTHORIZED_APPLICATION_ACCESS);
        }

        // PENDING 상태일 때만 수정 가능
        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new ProjectException(ProjectErrorCode.APPLICATION_NOT_EDITABLE);
        }

        // 지원서 정보 업데이트
        application.updateApplication(
                requestDto.getApplicationMessage(),
                requestDto.getAvailableStartDate(),
                requestDto.getAvailableTimeSlots(),
                requestDto.getTimePreferenceNote()
        );

        applicationRepository.save(application);
        return ApplicationDtoConverter.toMyApplicationDto(application);
    }

    @Transactional
    public void cancelApplication(Long applicationId, Long memberId) {
        ProjectApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ProjectException(ProjectErrorCode.APPLICATION_NOT_FOUND));

        // 본인의 지원서인지 확인
        if (!application.getMember().getMemberId().equals(memberId)) {
            throw new ProjectException(ProjectErrorCode.UNAUTHORIZED_APPLICATION_ACCESS);
        }

        // PENDING 상태일 때만 취소 가능
        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new ProjectException(ProjectErrorCode.APPLICATION_NOT_EDITABLE);
        }

        // 지원서 상태를 CANCELED로 변경
        application.updateStatus(ApplicationStatus.CANCELED);
        applicationRepository.save(application);
    }

    @Transactional(readOnly = true)
    public List<ApplicationListDto> getApplicationsByProject(Long projectId, Long requesterId) {
        // 프로젝트 존재 확인
        Project project = projectService.findByIdOrThrow(projectId);
        
        // 프로젝트 작성자인지 확인
        if (!project.getMember().getMemberId().equals(requesterId)) {
            throw new ProjectException(ProjectErrorCode.PROJECT_OWNER_ONLY_ACCESS);
        }

        // 프로젝트의 모든 지원서 조회 (지원 날짜 순으로 정렬)
        List<ProjectApplication> applications = applicationRepository.findByProjectOrderByAppliedAtDesc(project);
        
        return applications.stream()
                .map(ApplicationDtoConverter::toApplicationListDto)
                .toList();
    }
}
