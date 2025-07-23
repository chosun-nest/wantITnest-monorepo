package com.virtukch.nest.project.model;

import com.virtukch.nest.tag.model.Tag;
import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class ProjectTag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @Setter
    @ManyToOne
    @JoinColumn(name = "tag_id")
    private Tag tag;

    public static ProjectTag createProjectTag(Project project, Tag tag) {
        ProjectTag projectTag = new ProjectTag();
        projectTag.project = project;
        projectTag.tag = tag;

        return projectTag;
    }
}