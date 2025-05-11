package com.virtukch.nest.post_tag.repository;

import com.virtukch.nest.post_tag.model.PostTag;
import com.virtukch.nest.tag.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface PostTagRepository extends JpaRepository<PostTag, Long> {
    List<PostTag> findByPostId(Long postId);

    Object deleteAllByPostId(Long postId);

    List<PostTag> findAllByTagId(Long tagId);

    List<PostTag> findAllByPostId(Long postId);

    List<PostTag> findByPostIdIn(Collection<Long> postIds);
}
