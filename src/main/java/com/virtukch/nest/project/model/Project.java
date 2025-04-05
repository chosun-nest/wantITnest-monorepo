package com.virtukch.nest.project.model;

import com.virtukch.nest.common.model.BaseTimeEntity;
import com.virtukch.nest.member.model.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor
public class Project extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long projectId;

    //프로젝트 팀장 (erd 변경 필요)
    @ManyToOne
    @JoinColumn(name = "memberId", nullable = true)
    private Member projectLeader;

    //프로젝트 제목
    private String projectTitle;

    //프로젝트 내용 -> 프로젝트 설명 (erd 변경 필요)
    //TODO : ERD 변경해야함
    @Column(columnDefinition = "TEXT")
    private String projectDescription;

    //최대 모집 인원
    //TODO : ERD 추가해야함
    private int maxMember;

    //모집 마감 여부
    //TODO : ERD 추가해야함
    private boolean isClosed;

    //프로젝트 시작일 - 새로 추가함
    //TODO : ERD 추가해야함
    private LocalDate projectStartDate;

    //프로젝트 시작일 - 새로추가함
    //TODO : ERD 추가해야함
    private LocalDate projectEndDate;

    //Constructor
    public Project(Member projectLeader, String projectTitle, String projectDescription,
                   LocalDate startDate, LocalDate endDate, int maxMember) {
        this.projectLeader = projectLeader;
        this.projectTitle = projectTitle;
        this.projectDescription = projectDescription;
        this.maxMember = maxMember;
        this.projectStartDate = startDate;
        this.projectEndDate = endDate;
        this.isClosed = false;
    }

    public void closeRecruitment(){
        isClosed = true;
    }
}
