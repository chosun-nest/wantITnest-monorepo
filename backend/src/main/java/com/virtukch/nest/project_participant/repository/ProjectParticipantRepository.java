package com.virtukch.nest.project_participant.repository;

import com.virtukch.nest.project.model.ProjectParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectParticipantRepository extends JpaRepository<ProjectParticipant, Long> {

    List<ProjectParticipant> findByProjectId(Long projectId);
    List<ProjectParticipant> findByProjectIdAndPartAndMemberIdIsNull(Long projectId, ProjectParticipant.Part part);
    Optional<ProjectParticipant> findByProjectIdAndRole(Long projectId, ProjectParticipant.Role role);
    // 특정 프로젝트에서 해당 파트에 속한 모든 멤버를 조회
    List<ProjectParticipant> findByProjectIdAndPart(Long projectId, ProjectParticipant.Part part);
    Optional<ProjectParticipant> findByProjectIdAndMemberId(Long projectId, Long memberId);
    long countByProjectIdAndPartAndMemberIdIsNotNull(Long projectId, ProjectParticipant.Part part);
    long countByProjectIdAndPart(Long projectId, ProjectParticipant.Part part);
    List<ProjectParticipant> findByProjectIdAndMemberIdIsNotNull(Long projectId);
}