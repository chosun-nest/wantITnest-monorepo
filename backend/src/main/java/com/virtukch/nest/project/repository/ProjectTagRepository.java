package com.virtukch.nest.project.repository;

import com.virtukch.nest.project.model.ProjectTag;
import com.virtukch.nest.tag.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface ProjectTagRepository extends JpaRepository<ProjectTag, Long> {
    List<ProjectTag> findByProjectId(Long projectId);

    Object deleteAllByProjectId(Long projectId);

    List<ProjectTag> findAllById(Long tagId);

    List<ProjectTag> findByTagIdIn(Collection<Long> tagIds);

    List<ProjectTag> findAllByProjectId(Long projectId);

    List<ProjectTag> findByProjectIdIn(Collection<Long> projectIds);

    List<ProjectTag> findByTagIn(Collection<Tag> tags);
}
