package com.virtukch.nest.project.repository;

import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.project.model.Project;
import com.virtukch.nest.project.model.enums.ApplicationStatus;
import com.virtukch.nest.project.model.ProjectApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface ProjectApplicationRepository extends JpaRepository<ProjectApplication, Long> {
    
    // 지원 날짜 순으로 정렬 (최신순)
    List<ProjectApplication> findByMemberOrderByAppliedAtDesc(Member member);
    
    // 프로젝트별 지원서 조회 (지원 날짜 순으로 정렬)
    List<ProjectApplication> findByProjectOrderByAppliedAtDesc(Project project);

    Long countByProjectAndStatus(Project project, ApplicationStatus status);

    boolean existsByProjectAndMemberAndStatusNotIn(Project project, Member member, Collection<ApplicationStatus> statuses);
}
