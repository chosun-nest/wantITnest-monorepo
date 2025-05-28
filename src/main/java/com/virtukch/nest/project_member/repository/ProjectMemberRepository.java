package com.virtukch.nest.project_member.repository;

import com.virtukch.nest.project_member.model.ProjectMember;
import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.project.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {

    // 프로젝트 + 멤버로 해당 참가자 찾기 (리더인지 확인할 때도 유용)
    Optional<ProjectMember> findByProject_ProjectIdAndMember_MemberId(Long projectId, Long memberId);
}