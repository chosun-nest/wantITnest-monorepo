package com.virtukch.nest.comment.repository;

import com.virtukch.nest.comment.model.BoardType;
import com.virtukch.nest.comment.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByBoardTypeAndPostIdOrderByCreatedAtAsc(BoardType boardType, Long postId);
    boolean existsByBoardTypeAndPostIdAndParentId(BoardType boardType, Long postId, Long parentId);
    void deleteAllByPostId(Long postId);
    Optional<Comment> findById(Long commentId);

    boolean existsByParentId(Long parentId);

    @Query("SELECT c.postId, COUNT(c) FROM Comment c WHERE c.postId IN :postIds GROUP BY c.postId")
    List<Object[]> countByPostIdIn(@Param("postIds") List<Long> postIds);
}
