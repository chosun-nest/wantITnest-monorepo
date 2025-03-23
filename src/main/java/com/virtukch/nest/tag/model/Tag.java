package com.virtukch.nest.board.model;

import com.virtukch.nest.post.model.Post;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@Getter
public class Board {
    @Id
    @GeneratedValue
    private Long id;
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false) // 카테고리를 설정하지 않을 경우 자동으로 미분류로 들어감.
    private BoardType boardType = BoardType.UNCATEGORIZED;  // 게시판 유형 (NORMAL, NOTICE 등)

    @OneToMany(mappedBy = "board")
    private List<Post> posts = new ArrayList<>();
}
