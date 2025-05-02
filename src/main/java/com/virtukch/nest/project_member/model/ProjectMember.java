package com.virtukch.nest.project_member.model;

import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.project.model.Project;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ProjectMember {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "project_member_seq")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    private Project project;

    @Enumerated(EnumType.STRING)
    private Role role;

    private boolean isApproved;

    public enum Role {
        LEADER, MEMBER
    }
}