package com.virtukch.nest.comment.repository;

import com.virtukch.nest.comment.model.BoardType;
import com.virtukch.nest.comment.model.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    // 특정 게시글의 최상위 댓글들만 페이징하여 조회 (parentId가 null인 댓글들)
    @Query("""
            SELECT c FROM Comment c 
            WHERE c.boardType = :boardType 
            AND c.postId = :postId 
            AND c.parentId IS NULL
            ORDER BY c.createdAt ASC
            """)
    Page<Comment> findRootCommentsPaged(
            @Param("boardType") BoardType boardType,
            @Param("postId") Long postId,
            Pageable pageable);

    @Query("""
            SELECT c FROM Comment c 
            WHERE c.boardType = :boardType 
            AND c.postId = :postId 
            AND c.parentId IN :rootIds
            ORDER BY c.createdAt ASC
            """)
    List<Comment> findDirectRepliesByParentIds(
            @Param("boardType") BoardType boardType,
            @Param("postId") Long postId,
            @Param("rootIds") List<Long> parentIds);

    void deleteAllByPostId(Long postId);

    Optional<Comment> findById(Long commentId);

    boolean existsByParentId(Long parentId);

    @Query("SELECT c.postId, COUNT(c) FROM Comment c WHERE c.postId IN :postIds GROUP BY c.postId")
    List<Object[]> countByPostIdIn(@Param("postIds") List<Long> postIds);
}
