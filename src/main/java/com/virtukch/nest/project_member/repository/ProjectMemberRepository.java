package com.virtukch.nest.project_member.repository;

import com.virtukch.nest.project_member.model.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {

    List<ProjectMember> findByProjectId(Long projectId);
    List<ProjectMember> findByProjectIdAndPartAndMemberIdIsNull(Long projectId, ProjectMember.Part part);
    Optional<ProjectMember> findByProjectIdAndRole(Long projectId, ProjectMember.Role role);
    // 특정 프로젝트에서 해당 파트에 속한 모든 멤버를 조회
    List<ProjectMember> findByProjectIdAndPart(Long projectId, ProjectMember.Part part);
    Optional<ProjectMember> findByProjectIdAndMemberId(Long projectId, Long memberId);
    long countByProjectIdAndPartAndMemberIdIsNotNull(Long projectId, ProjectMember.Part part);
    long countByProjectIdAndPart(Long projectId, ProjectMember.Part part);
}