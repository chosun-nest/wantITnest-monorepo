package com.virtukch.nest.post.repository;

import com.virtukch.nest.post.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}
