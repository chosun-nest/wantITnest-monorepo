package com.virtukch.nest.project_member.model;

import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.project.model.Project;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ProjectMember {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "project_member_seq")
    private Long projectMemberId;

    private Long projectId;

    private Long memberId;

    @Enumerated(EnumType.STRING)
    private Role role; // 리더 or 멤버

    @Enumerated(EnumType.STRING)
    private Part part; // 백엔드, 프론트엔드 등


    private boolean isApproved;

    public enum Role {
        LEADER, MEMBER
    }

    public enum Part {
        BACKEND, FRONTEND, PM, DESIGN, AI, ETC
    }

    // 유효성 검사 메서드 (DTO or Service 단에서 사용 가능)
    public static boolean isValidPart(String input) {
        for (Part p : Part.values()) {
            if (p.name().equalsIgnoreCase(input)) {
                return true;
            }
        }
        return false;
    }

    public void removeMember() {
        this.memberId = null;
        this.isApproved = false;
    }
}