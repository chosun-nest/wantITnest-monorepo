package com.virtukch.nest.post_tag.repository;

import com.virtukch.nest.post_tag.model.PostTag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostTagRepository extends JpaRepository<PostTag, Long> {
}
