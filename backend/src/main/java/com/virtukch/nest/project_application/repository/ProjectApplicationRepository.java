package com.virtukch.nest.project_application.repository;

import com.virtukch.nest.project.model.enums.ApplicationStatus;
import com.virtukch.nest.project.model.ProjectApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ProjectApplicationRepository extends JpaRepository<ProjectApplication, Long> {
    List<ProjectApplication> findByProjectId(Long projectId);
    List<ProjectApplication> findByMemberId(Long memberId);

    Long countByProjectIdAndStatus(Long projectId, ApplicationStatus status);

    boolean existsByProjectIdAndMemberIdAndStatusNotIn(Long projectId, Long memberId, Collection<ApplicationStatus> statuses);
}
