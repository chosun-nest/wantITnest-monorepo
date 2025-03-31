package com.virtukch.nest.post.model;

import com.virtukch.nest.common.model.BaseTimeEntity;
import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.post_tag.model.PostTag;
import com.virtukch.nest.tag.model.Tag;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@Getter
public class Post extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Member member;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PostTag> postTags = new ArrayList<>();

    private String title;

    @Lob
    private String content;

    @Column(nullable = false)
    private Integer viewCount = 0; // 조회수

    @Column(nullable = false)
    private Integer likeCount = 0;

    @Builder
    public Post(Member member, String title, String content) {
        this.member = member;
        this.title = title;
        this.content = content;
    }

    // 연관관계 편의 메소드
    public void addPostTag(PostTag postTag) {
        postTags.add(postTag);           // 리스트에 추가
        postTag.setPost(this);           // 양방향 연관관계 설정
    }

    // 비즈니스 로직
    public void increaseViewCount() {
        this.viewCount += 1;
    }

    public void updatePost(String title, String content, List<Tag> newTags) {
        if (title != null && !title.isBlank()) {
            this.title = title;
        }
        if (content != null) {
            this.content = content;
        }
        if(newTags != null) {
            updatePostTags(newTags);
        }
    }

    private void updatePostTags(List<Tag> newTags) {
        postTags.clear();  // orphanRemoval = true 이므로 DB에서도 삭제됨
        for (Tag tag : newTags) {
            PostTag postTag = new PostTag(this, tag);
            this.addPostTag(postTag);
        }
    }
}
