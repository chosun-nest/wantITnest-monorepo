package com.virtukch.nest.post.repository;

import com.virtukch.nest.post.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findAll(Pageable pageable);

    // 특정 태그에 해당하는 게시물 조회 (페이징 적용)
    @Query("SELECT p FROM Post p JOIN PostTag pt ON p.id = pt.postId WHERE pt.tagId IN :tagIds")
    Page<Post> findByTagIds(@Param("tagIds") List<Long> tagIds, Pageable pageable);

    Page<Post> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);

    Page<Post> findByContentContainingIgnoreCase(String keyword, Pageable pageable);

    Page<Post> findByIdInAndTitleContainingIgnoreCase(Collection<Long> ids, String title, Pageable pageable);

    Page<Post> findByIdInAndContentContaining(Collection<Long> ids, String content, Pageable pageable);

    Page<Post> findByIdInAndTitleContainingIgnoreCaseOrIdInAndContentContaining(Collection<Long> ids, String title, Collection<Long> ids1, String content, Pageable pageable);

    Page<Post> findByTitleContainingIgnoreCaseOrContentContaining(String title, String content, Pageable pageable);
}