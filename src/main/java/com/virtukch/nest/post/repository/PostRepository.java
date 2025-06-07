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

    // 제목에서 키워드 검색 (대소문자 구분 없음)
    @Query("SELECT p FROM Post p WHERE UPPER(p.title) LIKE UPPER(CONCAT('%', :keyword, '%'))")
    Page<Post> searchByTitle(@Param("keyword") String keyword, Pageable pageable);

    // 내용에서 키워드 검색 (CLOB 타입이므로 UPPER 함수 제외 - 대소문자 구분)
    @Query("SELECT p FROM Post p WHERE p.content LIKE CONCAT('%', :keyword, '%')")
    Page<Post> searchByContent(@Param("keyword") String keyword, Pageable pageable);

    // 특정 ID 목록에서 제목 검색
    @Query("SELECT p FROM Post p WHERE p.id IN :ids AND UPPER(p.title) LIKE UPPER(CONCAT('%', :title, '%'))")
    Page<Post> searchByTitleInIds(@Param("ids") Collection<Long> ids,
                                  @Param("title") String title,
                                  Pageable pageable);

    // 특정 ID 목록에서 내용 검색
    @Query("SELECT p FROM Post p WHERE p.id IN :ids AND p.content LIKE CONCAT('%', :content, '%')")
    Page<Post> searchByContentInIds(@Param("ids") Collection<Long> ids,
                                    @Param("content") String content,
                                    Pageable pageable);

    // 특정 ID 목록에서 제목 또는 내용 검색 (복합 조건)
    @Query("SELECT p FROM Post p WHERE " +
            "(p.id IN :titleIds AND UPPER(p.title) LIKE UPPER(CONCAT('%', :title, '%'))) OR " +
            "(p.id IN :contentIds AND p.content LIKE CONCAT('%', :content, '%'))")
    Page<Post> searchByTitleOrContentInIds(@Param("titleIds") Collection<Long> titleIds,
                                           @Param("title") String title,
                                           @Param("contentIds") Collection<Long> contentIds,
                                           @Param("content") String content,
                                           Pageable pageable);

    // 제목 또는 내용에서 키워드 검색
    @Query("SELECT p FROM Post p WHERE " +
            "UPPER(p.title) LIKE UPPER(CONCAT('%', :title, '%')) OR " +
            "p.content LIKE CONCAT('%', :content, '%')")
    Page<Post> searchByTitleOrContent(@Param("title") String title,
                                      @Param("content") String content,
                                      Pageable pageable);
}