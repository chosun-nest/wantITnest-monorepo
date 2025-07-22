package com.virtukch.nest.project.model;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@EntityListeners(AuditingEntityListener.class)
public class ProjectRoleTechStack {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long roleId;        // ProjectRole FK
    private Long techStackId;   // TechStack FK

    private Boolean isRequired; // true: 필수, false: 우대사항

    @Enumerated(EnumType.STRING)
    private Proficiency proficiency;

    @CreatedDate
    private LocalDateTime createdAt;
}
