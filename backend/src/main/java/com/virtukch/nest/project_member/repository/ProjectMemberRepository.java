package com.virtukch.nest.project_member.repository;

import com.virtukch.nest.project_member.model.ProjectMember;
import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.project.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {

    List<ProjectMember> findByProjectId(Long projectId);
    List<ProjectMember> findByProjectIdAndPartAndMemberIdIsNull(Long projectId, ProjectMember.Part part);
    Optional<ProjectMember> findByProjectIdAndRole(Long projectId, ProjectMember.Role role);
}