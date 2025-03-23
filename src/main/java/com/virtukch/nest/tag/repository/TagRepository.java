package com.virtukch.nest.tag.repository;

import com.virtukch.nest.tag.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TagRepository extends JpaRepository<Tag, Long> {
}
