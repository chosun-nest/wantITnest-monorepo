package com.virtukch.nest.project.repository;

import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.project.model.Project;
import com.virtukch.nest.project.model.ProjectTag;
import com.virtukch.nest.project.model.enums.ParticipantStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Page<Project> findAll(Pageable pageable);

    Page<Project> findByTags(List<ProjectTag> tags, Pageable pageable);

    @Query("SELECT p FROM Project p " +
           "LEFT JOIN FETCH p.roles r " +
           "LEFT JOIN FETCH p.participants part " +
           "LEFT JOIN FETCH part.member " +
           "WHERE p.id = :projectId")
    Optional<Project> findByIdWithRolesAndParticipants(@Param("projectId") Long projectId);

    Page<Project> findByMember(Member member, Pageable pageable);

    @Query("SELECT DISTINCT p FROM Project p " +
           "JOIN p.participants part " +
           "WHERE part.member = :member AND part.status = :status")
    Page<Project> findByParticipantMemberAndStatus(@Param("member") Member member, 
                                                  @Param("status") ParticipantStatus status,
                                                  Pageable pageable);
}
