package com.virtukch.nest.tag_favorite.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class TagFavorite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tagFavoriteId;

    @Column(nullable = false)
    private Long memberId;

    @Column(nullable = false)
    private Long tagId;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    protected LocalDateTime createdAt;

    @Builder
    public TagFavorite(Long memberId, Long tagId) {
        this.memberId = memberId;
        this.tagId = tagId;
    }
}
