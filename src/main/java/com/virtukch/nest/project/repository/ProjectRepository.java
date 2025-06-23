package com.virtukch.nest.project.repository;

import com.virtukch.nest.post.model.Post;
import com.virtukch.nest.project.model.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Page<Project> findAll(Pageable pageable);

    // 특정 태그에 해당하는 게시물 조회 (페이징 적용)
    @Query("""
    SELECT p FROM Project p 
    JOIN ProjectTag pt ON p.projectId = pt.projectId 
    WHERE pt.tagId IN :tagIds
    """)
    Page<Project> findByTagIds(@Param("tagIds") List<Long> tagIds, Pageable pageable);

    // 제목 검색
    @Query("SELECT p FROM Project p WHERE UPPER(p.projectTitle) LIKE UPPER(CONCAT('%', :keyword, '%'))")
    Page<Project> searchByProjectTitle(@Param("keyword") String keyword, Pageable pageable);

    // 글 검색
    @Query("SELECT p FROM Project p WHERE p.projectDescription LIKE CONCAT('%', :keyword, '%')")
    Page<Project> searchByProjectDescriptionContaining(@Param("keyword")String keyword, Pageable pageable);

    // 프로젝트 제목으로 projectId 조회
    @Query("SELECT p.projectId FROM Project p WHERE UPPER(p.projectTitle) LIKE UPPER(CONCAT('%', :keyword, '%'))")
    List<Long> findIdsByProjectTitle(@Param("keyword") String keyword);

    // 프로젝트 설명으로 projectId 조회
    @Query("SELECT p.projectId FROM Project p WHERE p.projectDescription LIKE CONCAT('%', :keyword, '%')")
    List<Long> findIdsByProjectDescription(@Param("keyword") String keyword);


    @Query("SELECT p FROM Project p WHERE p.projectId IN :ids AND UPPER(p.projectTitle) LIKE UPPER(CONCAT('%', :title, '%'))")
    Page<Project> searchByProjectIdAndTitle(@Param("ids") Collection<Long> ids, @Param("title") String title, Pageable pageable);

    @Query("SELECT p FROM Project p WHERE p.projectId IN :ids AND p.projectDescription LIKE CONCAT('%', :description, '%')")
    Page<Project> searchByProjectIdAndDescription(@Param("ids") Collection<Long> ids, @Param("description") String description, Pageable pageable);

    @Query("""
SELECT p FROM Project p
WHERE 
    (p.projectId IN :titleIds AND UPPER(p.projectTitle) LIKE UPPER(CONCAT('%', :title, '%')))
    OR
    (p.projectId IN :descriptionIds AND p.projectDescription LIKE CONCAT('%', :description, '%'))
""")
    Page<Project> searchByProjectIdAndTitleOrDescription(
        @Param("titleIds") Collection<Long> titleIds,
        @Param("title") String title,
        @Param("descriptionIds") Collection<Long> descriptionIds,
        @Param("description") String description,
        Pageable pageable
    );

    // 디폴트 검색
    @Query("SELECT p FROM Project p WHERE " +
            "(p.projectId IN :titleIds AND UPPER(p.projectTitle) LIKE UPPER(CONCAT('%', :title, '%'))) OR " +
            "(p.projectId IN :descriptionIds AND p.projectDescription LIKE CONCAT('%', :description, '%'))")
    Page<Project> searchByProjectTitleOrProjectDescriptionInIds(
            @Param("titleIds") Collection<Long> titleIds,
            @Param("title") String title,
            @Param("descriptionIds") Collection<Long> descriptionIds,
            @Param("description") String description,
            Pageable pageable
    );

    @Query("SELECT p.memberId FROM Project p WHERE p.projectId = :projectId")
    Optional<Long> searchWriterIdByProjectId(@Param("projectId") Long projectId);
}
