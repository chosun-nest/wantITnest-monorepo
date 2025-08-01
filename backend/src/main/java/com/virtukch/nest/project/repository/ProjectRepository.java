package com.virtukch.nest.project.repository;

import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.project.model.Project;
import com.virtukch.nest.project.model.ProjectTag;
import com.virtukch.nest.project.model.enums.ParticipantStatus;
import com.virtukch.nest.project.model.enums.ProjectStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Page<Project> findAll(Pageable pageable);

    // 태그별 프로젝트 조회 (DELETED 제외)
    @Query("SELECT DISTINCT p FROM Project p " +
           "JOIN p.tags pt " +
           "WHERE pt IN :projectTags AND p.status != com.virtukch.nest.project.model.enums.ProjectStatus.DELETED")
    Page<Project> findByTags(@Param("projectTags") List<ProjectTag> projectTags, Pageable pageable);

    @Query("SELECT p FROM Project p " +
           "LEFT JOIN FETCH p.roles r " +
           "LEFT JOIN FETCH p.participants part " +
           "LEFT JOIN FETCH part.member " +
           "WHERE p.id = :projectId")
    Optional<Project> findByIdWithRolesAndParticipants(@Param("projectId") Long projectId);
    
    // 내 프로젝트 조회 (DELETED 제외)
    Page<Project> findByMemberAndStatusNot(Member member, ProjectStatus excludeStatus, Pageable pageable);

    @Query("SELECT DISTINCT p FROM Project p " +
           "JOIN p.participants part " +
           "WHERE part.member = :member AND part.status = :status")
    Page<Project> findByParticipantMemberAndStatus(@Param("member") Member member, 
                                                  @Param("status") ParticipantStatus status,
                                                  Pageable pageable);
                                                  
    // 참여 프로젝트 조회 (DELETED 제외)
    @Query("SELECT DISTINCT p FROM Project p " +
           "JOIN p.participants part " +
           "WHERE part.member = :member AND part.status = :status AND p.status != com.virtukch.nest.project.model.enums.ProjectStatus.DELETED")
    Page<Project> findByParticipantMemberAndStatusExcludeDeleted(@Param("member") Member member, 
                                                               @Param("status") ParticipantStatus status,
                                                               Pageable pageable);

    // 상태별 프로젝트 조회
    Page<Project> findByStatus(ProjectStatus status, Pageable pageable);
    
    // DELETED가 아닌 상태로 조회 (전체 조회시 사용)
    Page<Project> findByStatusNot(ProjectStatus status, Pageable pageable);

    // 태그와 상태 모두로 필터링
    @Query("SELECT DISTINCT p FROM Project p " +
           "JOIN p.tags pt " +
           "WHERE pt IN :projectTags AND p.status = :status")
    Page<Project> findByTagsAndStatus(@Param("projectTags") List<ProjectTag> projectTags, 
                                    @Param("status") ProjectStatus status, 
                                    Pageable pageable);
}
