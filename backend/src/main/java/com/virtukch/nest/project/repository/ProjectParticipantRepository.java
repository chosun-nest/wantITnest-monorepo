package com.virtukch.nest.project.repository;

import com.virtukch.nest.project.model.ProjectParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectParticipantRepository extends JpaRepository<ProjectParticipant, Long> {
    
    @Query("SELECT pp FROM ProjectParticipant pp WHERE pp.project.id = :projectId")
    List<ProjectParticipant> findByProjectId(@Param("projectId") Long projectId);
    
    @Query("SELECT pp FROM ProjectParticipant pp WHERE pp.project.id = :projectId AND pp.member.memberId = :memberId")
    Optional<ProjectParticipant> findByProjectIdAndMemberId(@Param("projectId") Long projectId, @Param("memberId") Long memberId);
}