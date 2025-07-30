package com.virtukch.nest.project.repository;

import com.virtukch.nest.project.model.ProjectRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRoleRepository extends JpaRepository<ProjectRole, Long> {
    @Query("SELECT DISTINCT pr FROM ProjectRole pr " +
            "LEFT JOIN FETCH pr.roleTechStacks prts " +
            "LEFT JOIN FETCH prts.techStack " +
            "WHERE pr.project.id = :projectId")
    List<ProjectRole> findByProjectIdWithTechStacks(@Param("projectId") Long projectId);
}
