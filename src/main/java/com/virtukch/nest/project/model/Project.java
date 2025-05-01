package com.virtukch.nest.project.model;

import com.virtukch.nest.common.model.BaseTimeEntity;
import com.virtukch.nest.member.model.Member;
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

    //프로젝트 제목
    private String projectTitle;

    //프로젝트 내용 -> 프로젝트 설명
    @Column(columnDefinition = "TEXT")
    @Lob
    private String projectDescription;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectMember> members = new ArrayList<>();

    //최대 모집 인원
    private int maxMember;

    //모집 마감 여부 (2025.05.02 UPDATE)
    @Column(nullable = false)
    private boolean isRecruiting;

    //조회수
    @Column(nullable = false)
    private Integer viewCount;

    //좋아요수
    @Column(nullable = false)
    private Integer likeCount;

    //프로젝트 시작일
    private LocalDate projectStartDate;

    //프로젝트 시작일
    private LocalDate projectEndDate;

    //생성 메서드
    @Builder
    public Project(
            String projectTitle,
            String projectDescription,
            Member leader,
            int maxMember,
            LocalDate projectStartDate,
            LocalDate projectEndDate
    ) {
        this.projectTitle = projectTitle;
        this.projectDescription = projectDescription;
        this.maxMember = maxMember;
        this.projectStartDate = projectStartDate;
        this.projectEndDate = projectEndDate;
        this.viewCount = 0;
        this.likeCount = 0;
        this.isRecruiting = false;
        this.members = new ArrayList<>();
        ProjectMember leaderMember = new ProjectMember(leader, this, ProjectMember.Role.LEADER);
        this.members.add(leaderMember);
    }

    public static Project createProject(String projectTitle, String projectDescription, Member leader, int maxMember, LocalDate projectStartDate, LocalDate projectEndDate) {
        return Project.builder()
                .projectTitle(projectTitle)
                .projectDescription(projectDescription)
                .leader(leader)
                .maxMember(maxMember)
                .projectStartDate(projectStartDate)
                .projectEndDate(projectEndDate)
                .build();
    }


    //모집 마감 메서드
    public void closeRecruitment(){
        isRecruiting = true;
    }

    //모집 오픈 메서드
    public void openRecruitment(){
        isRecruiting = false;
    }

    //조회수 증가 메서드
    public void incrementViewCount(){ this.viewCount++; }


    //좋아요 수 증가 메서드
    public void incrementLikeCount() {
        this.likeCount++;
    }

    //좋아요 수 감소 메서드
    public void decrementLikeCount() {
        if (this.likeCount > 0) this.likeCount--;
    }

    //프로젝트 리더 가져오는 메서드
    public Member getProjectLeader() {
        return members.stream()
                .filter(pm -> pm.getRole() == ProjectMember.Role.LEADER)
                .map(ProjectMember::getMember)
                .findFirst()
                .orElse(null); // orElseThrow 로 바꿔도 됨
    }
}
