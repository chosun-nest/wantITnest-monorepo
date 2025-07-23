package com.virtukch.nest.tag.repository;

import com.virtukch.nest.tag.model.Category;
import com.virtukch.nest.tag.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByName(String name);
    List<Tag> findByCategory(Category category);

    List<Tag> findAllByNameIn(Collection<String> names);

    List<Tag> findByNameIn(Collection<String> names);
}
