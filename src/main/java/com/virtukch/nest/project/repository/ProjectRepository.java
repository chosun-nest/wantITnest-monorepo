package com.virtukch.nest.project.repository;

import com.virtukch.nest.project.model.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Page<Project> findAll(Pageable pageable);

    // 특정 태그에 해당하는 게시물 조회 (페이징 적용)
    @Query("SELECT p FROM Project p JOIN ProjectTag pt ON p.memberId = pt.projectId WHERE pt.tagId IN :tagIds")
    Page<Project> findByTagIds(@Param("tagIds") List<Long> tagIds, Pageable pageable);
}
