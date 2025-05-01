package com.virtukch.nest.project_member.model;

import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.project.model.Project;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "project_member")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProjectMember {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private Project project;

    @ManyToOne
    private Member member;

    private boolean isApproved;

    @Enumerated(EnumType.STRING)
    private Role role;

    public enum Role {
        LEADER, MEMBER
    }

    public ProjectMember(Member member, Project project, Role role) {
        this.member = member;
        this.project = project;
        this.role = role;
        this.isApproved = true;
    }
}