package com.virtukch.nest.comment.repository;

import com.virtukch.nest.comment.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostIdOrderByCreatedAtAsc(Long postId);
    void deleteAllByPostId(Long postId);
    List<Comment> findByParentId(Long parentId);
    Optional<Comment> findById(Long commentId);

    boolean existsByParentId(Long parentId);
}
