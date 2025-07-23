package com.virtukch.nest.project.model;

import com.virtukch.nest.common.model.BaseTimeEntity;
import com.virtukch.nest.project.dto.request.RoleCreateRequestDto;
import com.virtukch.nest.project.exception.project_role.RoleCapacityExceededException;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProjectRole extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

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

    //======팩토리 메서드======
    public static ProjectRole createProjectRole(RoleCreateRequestDto requestDto) {
        ProjectRole role = new ProjectRole();
        role.roleName = requestDto.getRoleName();
        role.roleDescription = requestDto.getRoleDescription();
        role.additionalRequirements = requestDto.getAdditionalRequirements();
        role.requiredCount = requestDto.getRequiredCount();
        role.currentCount = 0;
        role.isActive = true;

        requestDto.getTechStacks().stream()
                .map(ProjectRoleTechStack::createProjectRoleTechStack)
                .toList()
                .forEach(role::addTechStack);

        return role;
    }

    //======비즈니스 편의 메서드======
    public void addTechStack(ProjectRoleTechStack projectRoleTechStack) {
        this.techStacks.add(projectRoleTechStack);
        projectRoleTechStack.setProjectRole(this);
    }

    public void increaseCurrentCount() {
        if(requiredCount <= currentCount) {
            throw new RoleCapacityExceededException(id, roleName, requiredCount, currentCount);
        }
        this.currentCount++;
    }
    public void decreaseCurrentCount() {
        this.currentCount--;
    }
}
