package com.virtukch.nest.project.repository;

import com.virtukch.nest.project.model.Project;
import com.virtukch.nest.project.model.ProjectParticipant;
import com.virtukch.nest.project.model.enums.ParticipantStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectParticipantRepository extends JpaRepository<ProjectParticipant, Long> {
    
    @Query("SELECT p.project FROM ProjectParticipant p WHERE p.memberId = :memberId AND p.status = :status")
    Page<Project> findProjectsByMemberIdAndStatus(
        @Param("memberId") Long memberId,
        @Param("status") ParticipantStatus status,
        Pageable pageable
    );
}