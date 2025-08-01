package com.virtukch.nest.project.model;

import com.virtukch.nest.common.model.BaseTimeEntity;
import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.project.dto.request.ProjectUpdateRequestDto;
import com.virtukch.nest.project.exception.ProjectErrorCode;
import com.virtukch.nest.project.exception.ProjectException;
import com.virtukch.nest.project.model.enums.ProjectStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Entity
@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Project extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; //프로젝트 아이디

    @Builder.Default
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProjectRole> roles = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProjectApplication> applications = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProjectParticipant> participants = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProjectTag> tags = new ArrayList<>();

    //글 작성자
    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    //프로젝트 제목
    @Column(nullable = false)
    private String projectTitle;

    //프로젝트 설명
    @Column(columnDefinition = "TEXT")
    private String projectDescription;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isRecruiting = true;

    @Column(nullable = false)
    private ProjectStatus status;

    //조회수
    @Builder.Default
    @Column(nullable = false)
    private Integer viewCount = 0;

    // 총 모집 인원 : 추가된 역할을 기준으로 자동 계산됨
    @Column(nullable = false)
    private Integer totalMemberNeeded;
    
    // 현재까지 모집된 인원
    private Integer currentMembers;

    // 프로젝트 모집 마감 기한
    @Column(nullable = false)
    private LocalDateTime recruitmentEndDate;
    
    // 프로젝트 시작 일자
    @Column(nullable = false)
    private LocalDateTime projectStartDate;
    
    // 프로젝트 종료 일자
    @Column(nullable = false)
    private LocalDateTime projectEndDate;

    // image url
    @Column(columnDefinition = "TEXT")
    private String imageUrls;

    //======팩토리 메서드======
    public static Project create(Member member, String title, String description, Integer totalMemberNeeded,
                                 LocalDateTime recruitmentEndDate, LocalDateTime projectStartDate, LocalDateTime projectEndDate) {
        if(title == null || title.isBlank()) {
            throw new ProjectException(ProjectErrorCode.INVALID_PROJECT_TITLE);
        }
        if(totalMemberNeeded == null || totalMemberNeeded == 0) {
            throw new ProjectException(ProjectErrorCode.INVALID_TOTAL_MEMBER_COUNT);
        }

        return Project.builder()
                .member(member)
                .projectTitle(title)
                .projectDescription(description)
                .status(ProjectStatus.RECRUITING)
                .totalMemberNeeded(totalMemberNeeded)
                .currentMembers(1) // 글 작성자는 반드시 프로젝트에 참여하므로
                .recruitmentEndDate(recruitmentEndDate)
                .projectStartDate(projectStartDate)
                .projectEndDate(projectEndDate)
                .build();
    }

    // 편의 메서드
    public void addRole(ProjectRole role) {
        roles.add(role);
        role.setProject(this);
    }

    public void addTag(ProjectTag tag) {
        tags.add(tag);
        tag.setProject(this);
    }

    public void addParticipant(ProjectParticipant participant) {
        participants.add(participant);
        participant.setProject(this);
    }

    //조회수 증가 메서드
    public void increaseViewCount(){
        this.viewCount++;
    }


    //프로젝트 업데이트 메서드
    public void updateProject(ProjectUpdateRequestDto requestDto, List<ProjectTag> projectTags) {
        if(requestDto.getProjectTitle() != null && !requestDto.getProjectTitle().isBlank()) {
            projectTitle = requestDto.getProjectTitle();
        } else if (requestDto.getProjectTitle() != null && requestDto.getProjectTitle().isBlank()) {
            throw new ProjectException(ProjectErrorCode.INVALID_PROJECT_TITLE);
        }

        if(requestDto.getProjectDescription() != null)
            projectDescription = requestDto.getProjectDescription();

        if(requestDto.getRecruitmentEndDate() != null)
            recruitmentEndDate = requestDto.getRecruitmentEndDate();

        if(requestDto.getProjectStartDate() != null)
            projectStartDate = requestDto.getProjectStartDate();

        if(requestDto.getProjectEndDate() != null)
            projectEndDate = requestDto.getProjectEndDate();

        if(requestDto.getIsRecruiting() != null)
            isRecruiting = requestDto.getIsRecruiting();

        if(projectTags != null)
            tags =  projectTags;
    }

    public void updateStatus(ProjectStatus status) {
        if(status != null)
            this.status = status;
    }

    public List<String> getImageUrlList() {
        if(imageUrls == null || imageUrls.isEmpty()) {
            return Collections.emptyList();
        }
        return Arrays.asList(imageUrls.split("\\|\\|"));
    }
    
    /**
     * 총 모집 인원 수 업데이트
     */
    public void updateTotalMemberNeeded(Integer totalMemberNeeded) {
        this.totalMemberNeeded = totalMemberNeeded;
    }
}
