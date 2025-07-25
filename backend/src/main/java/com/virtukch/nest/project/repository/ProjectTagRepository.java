package com.virtukch.nest.project.repository;

import com.virtukch.nest.project.model.ProjectTag;
import com.virtukch.nest.tag.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface ProjectTagRepository extends JpaRepository<ProjectTag, Long> {
    @Query("SELECT t.name FROM Tag t " +
            "JOIN ProjectTag pt ON t.id = pt.tag.id " +
            "WHERE pt.project.projectId = :projectId")
    List<String> findTagNamesByProjectId(@Param("projectId") Long projectId);

    List<ProjectTag> findByTagIn(Collection<Tag> tags);
}
