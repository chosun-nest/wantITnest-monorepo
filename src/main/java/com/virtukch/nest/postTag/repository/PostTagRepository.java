package com.virtukch.nest.postTag.repository;

import com.virtukch.nest.postTag.model.PostTag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostTagRepository extends JpaRepository<PostTag, Long> {
}
