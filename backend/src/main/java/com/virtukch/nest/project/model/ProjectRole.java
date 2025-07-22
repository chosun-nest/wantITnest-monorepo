package com.virtukch.nest.project.model;

import com.virtukch.nest.common.model.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
public class ProjectRole extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long projectId;

    @Column(nullable = false)
    private String roleName;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String roleDescription;

    @Column(columnDefinition = "TEXT")
    private String additionalRequirements;

    @Column(nullable = false)
    private Integer requiredCount;

    @Column(nullable = false)
    private Integer currentCount;

    @Column(nullable = false)
    private Boolean isActive;

    @OneToMany(mappedBy = "roleId", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProjectRoleTechStack> techStacks = new ArrayList<>();

}
