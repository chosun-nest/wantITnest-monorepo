package com.virtukch.nest.project.repository;

import com.virtukch.nest.post.model.Post;
import com.virtukch.nest.project.model.Project;
import com.virtukch.nest.project.model.ProjectTag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Page<Project> findAll(Pageable pageable);

    Page<Project> findByTags(List<ProjectTag> tags, Pageable pageable);

    Page<Project> findByCreatorMemberId(Long memberId, Pageable pageable);

    @Query("SELECT p FROM Project p " +
           "LEFT JOIN FETCH p.roles r " +
           "LEFT JOIN FETCH p.participants part " +
           "LEFT JOIN FETCH part.member " +
           "WHERE p.projectId = :projectId")
    Optional<Project> findByIdWithRolesAndParticipants(@Param("projectId") Long projectId);
}
