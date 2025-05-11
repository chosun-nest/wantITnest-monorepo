package com.virtukch.nest.tag_favorite.repository;

import com.virtukch.nest.tag_favorite.model.TagFavorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TagFavoriteRepository extends JpaRepository<TagFavorite, Long> {
    Optional<TagFavorite> findByMemberIdAndTagId(Long memberId, Long tagId);
    List<TagFavorite> findByMemberId(Long memberId);
    void deleteByMemberIdAndTagId(Long memberId, Long tagId);
}

