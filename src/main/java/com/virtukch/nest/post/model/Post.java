package com.virtukch.nest.post.model;

import com.virtukch.nest.member.model.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// Board 엔티티와 매핑해야 해서, 일단 엔티티만 제작.
@Entity
@NoArgsConstructor
@Getter
public class PostTag {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Member member;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<com.virtukch.nest.postTag.model.PostTag> postTags = new ArrayList<>();

    private String title;

    @Lob
    private String content;

    private Integer viewCount;
    private Integer likeCount;

    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
