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
    @Query("SELECT p FROM Project p JOIN ProjectTag pt ON p.memberId = pt.projectId WHERE pt.tagId IN :tagIds")
    Page<Project> findByTagIds(@Param("tagIds") List<Long> tagIds, Pageable pageable);

    // 제목 검색
    @Query("SELECT p FROM Project p WHERE p.projectTitle LIKE CONCAT('%', :keyword, '%')")
    Page<Project> findByProjectTitle(@Param("keyword") String keyword, Pageable pageable);

    // 글 검색
    @Query("SELECT p FROM Project p WHERE p.projectDescription LIKE CONCAT('%', :keyword, '%')")
    Page<Project> findByProjectDescriptionContaining(@Param("keyword")String keyword, Pageable pageable);


    @Query("SELECT p FROM Project p WHERE p.projectId IN :ids AND p.projectTitle LIKE CONCAT('%', :title, '%')")
    Page<Project> findByProjectIdAndTitle(@Param("ids") Collection<Long> ids, @Param("title") String title, Pageable pageable);

    @Query("SELECT p FROM Project p WHERE p.projectId IN :ids AND p.projectDescription LIKE CONCAT('%', :description, '%')")
    Page<Project> findByProjectIdAndDescription(@Param("ids") Collection<Long> ids, @Param("description") String description, Pageable pageable);

    @Query("""
SELECT p FROM Project p
WHERE 
    (p.projectId IN :titleIds AND p.projectTitle LIKE CONCAT('%', :title, '%'))
    OR
    (p.projectId IN :descriptionIds AND p.projectDescription LIKE CONCAT('%', :description, '%'))
""")
    Page<Project> findByProjectIdAndTitleOrDescription(
        @Param("titleIds") Collection<Long> titleIds,
        @Param("title") String title,
        @Param("descriptionIds") Collection<Long> descriptionIds,
        @Param("description") String description,
        Pageable pageable
    );

    // 디폴트 검색
    @Query("SELECT p FROM Project p WHERE " +
            "p.projectTitle LIKE CONCAT('%', :title, '%') OR " +
            "p.projectDescription LIKE CONCAT('%', :description, '%')")
    Page<Project> findByProjectTitleContainingIgnoreCaseOrProjectDescriptionContaining(@Param("title")String title, @Param("description")String description, Pageable pageable);

    @Query("SELECT p.memberId FROM Project p WHERE p.projectId = :projectId")
    Optional<Long> findWriterIdByProjectId(@Param("projectId") Long projectId);
}
