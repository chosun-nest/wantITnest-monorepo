package com.virtukch.nest.comment.repository;

import com.virtukch.nest.comment.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostIdOrderByCommentIdAsc(Long postId);
    void deleteAllByPostId(Long postId);
}
