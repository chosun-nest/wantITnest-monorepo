package com.virtukch.nest.post_tag.model;

import com.virtukch.nest.post.model.Post;
import com.virtukch.nest.tag.model.Tag;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Getter
public class PostTag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @Setter
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    private Tag tag;

    // ✅ 생성자에서 연관관계 설정 (기본)
    @Builder
    public PostTag(Post post, Tag tag) {
        this.post = post;
        this.tag = tag;
    }
}