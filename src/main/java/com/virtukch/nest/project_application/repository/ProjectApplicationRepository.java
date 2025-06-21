package com.virtukch.nest.project_application.repository;

import com.virtukch.nest.project_application.model.ProjectApplication;
import com.virtukch.nest.project_member.model.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectApplicationRepository extends JpaRepository<ProjectApplication, Long> {
    List<ProjectApplication> findByProjectId(Long projectId);
    List<ProjectApplication> findByMemberId(Long memberId);
    Optional<ProjectApplication> findByProjectIdAndMemberIdAndPart(Long projectId, Long memberId, ProjectMember.Part part);
    long countByProjectIdAndStatus(Long projectId, ProjectApplication.ApplicationStatus status);
}
