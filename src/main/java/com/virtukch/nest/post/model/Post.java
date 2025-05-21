package com.virtukch.nest.post.model;

import com.virtukch.nest.common.model.BaseTimeEntity;
import com.virtukch.nest.post.exception.InvalidPostTitleException;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Post extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long memberId;

    private String title;

    @Lob
    private String content;

    @Column(nullable = false)
    private Long viewCount = 0L; // 조회수

    @Setter
    @Column(nullable = false)
    private Long likeCount = 0L;

    @Setter
    @Column(nullable = false)
    private Long dislikeCount = 0L;


    // 생성 편의 메서드
    public static Post createPost(Long memberId, String title, String content) {
        if(title == null || title.isBlank()) {
            throw new InvalidPostTitleException();
        }

        Post post = new Post();
        post.memberId = memberId;
        post.title = title;
        post.content = content;

        return post;
    }

    // 비즈니스 로직
    public void increaseViewCount() {
        this.viewCount += 1;
    }

    public void updatePost(String title, String content) {
        if (title != null && !title.isBlank()) this.title = title;
        else throw new InvalidPostTitleException();
        if (content != null) this.content = content;
    }
}
