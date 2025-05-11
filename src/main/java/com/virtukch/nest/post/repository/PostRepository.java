package com.virtukch.nest.post.repository;

import com.virtukch.nest.post.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findAll(Pageable pageable);

    // 특정 태그에 해당하는 게시물 조회 (페이징 적용)
    @Query("SELECT p FROM Post p JOIN PostTag pt ON p.id = pt.postId WHERE pt.tagId IN :tagIds")
    Page<Post> findByTagIds(@Param("tagIds") List<Long> tagIds, Pageable pageable);
}
