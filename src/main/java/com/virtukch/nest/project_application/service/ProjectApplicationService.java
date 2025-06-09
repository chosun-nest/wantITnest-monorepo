package com.virtukch.nest.project_application.service;

import com.virtukch.nest.project_application.dto.ProjectApplicationRequestDto;
import com.virtukch.nest.project_application.dto.ProjectApplicationResponseDto;
import com.virtukch.nest.project_application.dto.converter.ProjectApplicationDtoConverter;
import com.virtukch.nest.project_application.model.ProjectApplication;
import com.virtukch.nest.project_application.repository.ProjectApplicationRepository;
import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.member.repository.MemberRepository;
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

    @Transactional
    public ProjectApplicationResponseDto applyToProject(Long projectId, Long memberId, ProjectApplicationRequestDto requestDto) {
        // 중복 지원 방지
        if (projectApplicationRepository.findByProjectIdAndMemberIdAndPart(projectId, memberId, requestDto.getPart()).isPresent()) {
            throw new IllegalStateException("이미 지원한 파트입니다.");
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
}
