package com.virtukch.nest.post.model;

import com.virtukch.nest.common.model.BaseTimeEntity;
import com.virtukch.nest.post.exception.InvalidPostTitleException;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

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

    // || 구분자로 이미지 URL을 저장
    @Column(columnDefinition = "TEXT")
    private String imageUrls;

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
        // title이 제공되었고 유효한 경우에만 수정
        if (title != null && !title.isBlank()) {
            this.title = title;
        }
        // title이 빈 문자열("")이면서 null이 아닌 경우 예외 발생
        else if (title != null && title.isBlank()) {
            throw new InvalidPostTitleException();
        }

        // content는 null이 아니면 수정 (빈 문자열도 허용)
        if (content != null)
            this.content = content;
    }

    public void updatePost(String title, String content, List<String> imageUrls) {
        // title이 제공되었고 유효한 경우에만 수정
        if (title != null && !title.isBlank()) {
            this.title = title;
        }
        // title이 빈 문자열("")이면서 null이 아닌 경우 예외 발생
        else if (title != null && title.isBlank()) {
            throw new InvalidPostTitleException();
        }

        // content는 null이 아니면 수정 (빈 문자열도 허용)
        if (content != null)
            this.content = content;

        if (imageUrls != null) {
            this.imageUrls = imageUrls.isEmpty() ? null : String.join("||", imageUrls);
        }
    }

    public List<String> getImageUrlList() {
        if (imageUrls == null || imageUrls.isEmpty()) {
            return Collections.emptyList();
        }
        return Arrays.asList(imageUrls.split("\\|\\|"));
    }
}
