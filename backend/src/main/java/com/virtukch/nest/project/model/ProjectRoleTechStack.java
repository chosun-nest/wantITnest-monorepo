package com.virtukch.nest.project.model;

import com.virtukch.nest.project.model.enums.Proficiency;
import com.virtukch.nest.tech_stack.model.TechStack;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@EntityListeners(AuditingEntityListener.class)
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class ProjectRoleTechStack {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @ManyToOne
    @JoinColumn(name = "project_role_id")
    private ProjectRole projectRole;

    @ManyToOne
    @JoinColumn(name = "tech_stack_id")
    private TechStack techStack;

    @Column(nullable = false)
    private Boolean isRequired; // true: 필수, false: 우대사항

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private Proficiency proficiency = Proficiency.NONE;

    @CreatedDate
    private LocalDateTime createdAt;

    //======팩토리 메서드=====
    public static ProjectRoleTechStack create(ProjectRole projectRole, TechStack techStack, Boolean isRequired, Proficiency proficiency) {

        return ProjectRoleTechStack.builder()
                .projectRole(projectRole)
                .techStack(techStack)
                .isRequired(isRequired)
                .proficiency(proficiency)
                .build();
    }
}
