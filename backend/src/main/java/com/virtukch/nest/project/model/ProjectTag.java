package com.virtukch.nest.project.model;

import com.virtukch.nest.tag.model.Tag;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class ProjectTag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 다대다 중간 테이블이므로 EAGER 유지
    // projectTag의 PK만 필요한 경우는 거의 없음
    @Setter
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @Setter
    @ManyToOne
    @JoinColumn(name = "tag_id")
    private Tag tag;

    public static ProjectTag create(Project project, Tag tag) {
        return ProjectTag.builder()
                .project(project)
                .tag(tag)
                .build();
    }
}