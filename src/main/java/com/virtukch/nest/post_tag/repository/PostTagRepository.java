package com.virtukch.nest.post_tag.repository;

import com.virtukch.nest.post_tag.model.PostTag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface PostTagRepository extends JpaRepository<PostTag, Long> {

    Object deleteAllByPostId(Long postId);

    List<PostTag> findAllByPostId(Long postId);

    List<PostTag> findByPostIdIn(Collection<Long> postIds);

    List<PostTag> findByTagIdIn(Collection<Long> tagIds);

}
