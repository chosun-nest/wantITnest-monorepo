package com.virtukch.nest.project.model;

import com.virtukch.nest.project.dto.request.RoleTechStackRequestDto;
import com.virtukch.nest.project.model.enums.Proficiency;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@EntityListeners(AuditingEntityListener.class)
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

    @Column(nullable = false)
    private Long techStackId;   // TechStack FK

    @Column(nullable = false)
    private Boolean isRequired; // true: 필수, false: 우대사항

    @Enumerated(EnumType.STRING)
    private Proficiency proficiency =  Proficiency.NONE;

    @CreatedDate
    private LocalDateTime createdAt;

    //======팩토리 메서드=====
    public static ProjectRoleTechStack createProjectRoleTechStack(RoleTechStackRequestDto requestDto) {
        ProjectRoleTechStack roleTechStack = new ProjectRoleTechStack();

        roleTechStack.techStackId = requestDto.getTechStackId();
        roleTechStack.isRequired = requestDto.getIsRequired();
        roleTechStack.proficiency = requestDto.getProficiency();

        return roleTechStack;
    }
}
