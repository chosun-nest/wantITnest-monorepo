package com.virtukch.nest.project_application.repository;

import com.virtukch.nest.project_application.model.ProjectApplication;
import com.virtukch.nest.project_member.model.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ProjectApplicationRepository extends JpaRepository<ProjectApplication, Long> {
    List<ProjectApplication> findByProjectId(Long projectId);
    List<ProjectApplication> findByMemberId(Long memberId);
    Optional<ProjectApplication> findByProjectIdAndMemberIdAndStatus(Long projectId, Long memberId, ProjectApplication.ApplicationStatus status);
    //Optional<ProjectApplication> findByProjectIdAndMemberId(Long projectId, Long memberId);
    long countByProjectIdAndStatus(Long projectId, ProjectApplication.ApplicationStatus status);

    boolean existsByProjectIdAndMemberIdAndStatusNotIn(Long projectId, Long memberId, Collection<ProjectApplication.ApplicationStatus> statuses);
}
