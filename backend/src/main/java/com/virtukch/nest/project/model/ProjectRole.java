package com.virtukch.nest.project.model;

import com.virtukch.nest.common.model.BaseTimeEntity;
import com.virtukch.nest.project.exception.ProjectException;
import com.virtukch.nest.project.exception.ProjectErrorCode;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProjectRole extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Builder.Default
    @OneToMany(mappedBy = "projectRole", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProjectRoleTechStack> roleTechStacks = new ArrayList<>();

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

    //======팩토리 메서드======
    public static ProjectRole create(String roleName, String roleDescription, String additionalRequirements, Integer requiredCount) {
        return ProjectRole.builder()
                .roleName(roleName)
                .roleDescription(roleDescription)
                .additionalRequirements(additionalRequirements)
                .requiredCount(requiredCount)
                .currentCount(0)
                .isActive(true)
                .build();
    }

    //======비즈니스 편의 메서드======
    public void addTechStack(ProjectRoleTechStack projectRoleTechStack) {
        this.roleTechStacks.add(projectRoleTechStack);
        projectRoleTechStack.setProjectRole(this);
    }

    public void increaseCurrentCount() {
        if(requiredCount <= currentCount) {
            throw new ProjectException(ProjectErrorCode.ROLE_CAPACITY_EXCEEDED);
        }
        this.currentCount++;
        if(requiredCount.equals(currentCount)) {
            isActive = false;
        }
    }
    
    public void updateBasicInfo(String roleName, String roleDescription, String additionalRequirements, Integer requiredCount) {
        this.roleName = roleName;
        this.roleDescription = roleDescription;
        this.additionalRequirements = additionalRequirements;
        this.requiredCount = requiredCount;

        this.isActive = this.currentCount < requiredCount;
    }
}
