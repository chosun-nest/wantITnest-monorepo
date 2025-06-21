package com.virtukch.nest.project.repository;

import com.virtukch.nest.post.model.Post;
import com.virtukch.nest.project.model.Project;
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

    // 특정 태그에 해당하는 게시물 조회 (페이징 적용)
    @Query("SELECT p FROM Project p JOIN ProjectTag pt ON p.memberId = pt.projectId WHERE pt.tagId IN :tagIds")
    Page<Project> findByTagIds(@Param("tagIds") List<Long> tagIds, Pageable pageable);

    Page<Project> findByProjectTitleContainingIgnoreCase(String keyword, Pageable pageable);

    Page<Project> findByProjectDescriptionContainingIgnoreCase(String keyword, Pageable pageable);

    Page<Project> findByProjectIdInAndProjectTitleContainingIgnoreCase(Collection<Long> ids, String title, Pageable pageable);

    Page<Project> findByProjectIdInAndProjectDescriptionContaining(Collection<Long> ids, String description, Pageable pageable);

    Page<Project> findByProjectIdInAndProjectTitleContainingIgnoreCaseOrProjectIdInAndProjectDescriptionContainingIgnoreCase(Collection<Long> ids, String title, Collection<Long> ids1, String description, Pageable pageable);

    Page<Project> findByProjectTitleContainingIgnoreCaseOrProjectDescriptionContainingIgnoreCase(String title, String description, Pageable pageable);

    @Query("SELECT p.memberId FROM Project p WHERE p.projectId = :projectId")
    Optional<Long> findWriterIdByProjectId(@Param("projectId") Long projectId);
}
