package com.virtukch.nest.project.model;

import com.virtukch.nest.common.model.BaseTimeEntity;
import com.virtukch.nest.project.exception.InvalidProjectTitleException;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
public class Project extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long projectId; //프로젝트 아이디

    @OneToMany(mappedBy = "projectId", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProjectRole> roles = new ArrayList<>();

    @OneToMany(mappedBy = "projectId", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProjectApplication> applications = new ArrayList<>();

    @OneToMany(mappedBy = "projectId", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProjectParticipant> participants = new ArrayList<>();

    private Long memberId;

    //프로젝트 제목
    private String projectTitle;

    //프로젝트 설명
    @Lob
    private String projectDescription;

    @Column(nullable = false)
    private Boolean isRecruiting = true;

    @Column(nullable = false)
    private ProjectStatus status;

    //조회수
    @Column(nullable = false)
    private Integer viewCount = 0;
    
    // 총 모집 인원 : 추가된 역할을 기준으로 자동 계산됨
    private Integer totalMemberNeeded;
    
    // 현재까지 모집된 인원
    private Integer currentMembers;

    // 프로젝트 모집 마감 기한
    private LocalDateTime recruitmentEndDate;
    
    // 프로젝트 시작 일자
    private LocalDateTime projectStartDate;
    
    // 프로젝트 종료 일자
    private LocalDateTime projectEndDate;

    // image url
    @Column(columnDefinition = "TEXT")
    private String imageUrls;


    public static Project createProject(Long memberId, String projectTitle, String projectDescription) {
        if(projectTitle == null || projectTitle.isBlank()) {
            throw new InvalidProjectTitleException();
        }

        Project project = new Project();
        project.memberId = memberId;
        project.projectTitle = projectTitle;
        project.projectDescription = projectDescription;

        return project;
    }


    //조회수 증가 메서드
    public void increaseViewCount(){
        this.viewCount++;
    }


    //프로젝트 업데이트 메서드
    public void updateProject(String projectTitle,
                              String projectDescription,
                              Boolean isRecruiting) {
        if(projectTitle != null && !projectTitle.isBlank()) {
            this.projectTitle = projectTitle;
        } else throw new InvalidProjectTitleException();

        if(projectDescription != null && !projectDescription.isBlank()) {
            this.projectDescription = projectDescription;
        }

        this.isRecruiting = isRecruiting;
    }

    public void updateProject(String projectTitle,
                              String projectDescription,
                              Boolean isRecruiting,
                              List<String> imageUrls) {
        updateProject(projectTitle, projectDescription,  isRecruiting);
        if(imageUrls != null) {
            this.imageUrls = imageUrls.isEmpty() ? null : String.join("||", imageUrls);
        }
    }

    public List<String> getImageUrlList() {
        if(imageUrls == null || imageUrls.isEmpty()) {
            return Collections.emptyList();
        }
        return Arrays.asList(imageUrls.split("\\|\\|"));
    }
}
