package com.virtukch.nest.project.repository;

import com.virtukch.nest.project.model.ProjectRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRoleRepository extends JpaRepository<ProjectRole, Long> {
}
