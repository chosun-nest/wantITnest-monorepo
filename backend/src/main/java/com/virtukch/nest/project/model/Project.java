package com.virtukch.nest.project.model;

import com.virtukch.nest.common.model.BaseTimeEntity;
import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.post.exception.InvalidPostTitleException;
import com.virtukch.nest.post.model.Post;
import com.virtukch.nest.project.dto.ProjectUpdateRequestDto;
import com.virtukch.nest.project.exception.InvalidProjectTitleException;
import com.virtukch.nest.project_member.model.ProjectMember;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
public class Project extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long projectId; //프로젝트 아이디

    private Long memberId;

    //프로젝트 제목
    private String projectTitle;

    //프로젝트 내용 -> 프로젝트 설명
    @Lob
    private String projectDescription;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectMember> members = new ArrayList<>();

    //최대 모집 인원
    @Column(nullable = false)
    private int maxMember;

    //모집 마감 여부 (2025.05.02 UPDATE)
    @Column(nullable = false)
    private boolean isRecruiting = true;

    //조회수
    @Column(nullable = false)
    private Integer viewCount = 0;


    public static Project createProject(Long memberId,
                                        String projectTitle,
                                        String projectDescription,
                                        int maxMember) {
        if(projectTitle == null || projectTitle.isBlank()) {
            throw new InvalidProjectTitleException();
        }

        Project project = new Project();
        project.memberId = memberId;
        project.projectTitle = projectTitle;
        project.projectDescription = projectDescription;
        project.maxMember = maxMember;

        return project;
    }


    //조회수 증가 메서드
    public void incrementViewCount(){ this.viewCount++; }


    //프로젝트 리더 가져오는 메서드
    public Member getProjectLeader() {
        return members.stream()
                .filter(pm -> pm.getRole() == ProjectMember.Role.LEADER)
                .map(ProjectMember::getMember)
                .findFirst()
                .orElse(null); // orElseThrow 로 바꿔도 됨
    }

    //프로젝트 업데이트 메서드
    public void updateProject(String projectTitle,
                              String projectDescription,
                              int maxMember,
                              boolean isRecruiting) {
        if(projectTitle != null && !projectTitle.isBlank()) {
            this.projectTitle = projectTitle;
        } else throw new InvalidProjectTitleException();

        if(projectDescription != null && !projectDescription.isBlank()) {
            this.projectDescription = projectDescription;
        }

        if (maxMember > 0) {
            this.maxMember = maxMember;
        }

        if(isRecruiting) {
            this.isRecruiting = true;
        } else {
            this.isRecruiting = false;
        }
    }
}
