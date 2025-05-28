package com.virtukch.nest.project_tag.repository;

import com.virtukch.nest.project_tag.model.ProjectTag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface ProjectTagRepository extends JpaRepository<ProjectTag, Long> {
    List<ProjectTag> findByProjectId(Long projectId);

    Object deleteAllByProjectId(Long projectId);

    List<ProjectTag> findAllByTagId(Long tagId);

    List<ProjectTag> findAllByProjectId(Long projectId);

    List<ProjectTag> findByProjectIdIn(Collection<Long> projectIds);
}
