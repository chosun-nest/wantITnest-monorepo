package com.virtukch.nest.project.repository;

import com.virtukch.nest.project.model.ProjectRole;
import com.virtukch.nest.project.model.ProjectRoleTechStack;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface ProjectRoleTechStackRepository extends JpaRepository<ProjectRoleTechStack, Long> {
    List<ProjectRoleTechStack> getProjectRoleTechStackByProjectRoleIdIn(Collection<Long> projectRoleIds);
    void deleteByProjectRole(ProjectRole projectRole);
}
