package com.virtukch.nest.project.model;

import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.project.model.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class ProjectApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long applicationId;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne
    @JoinColumn(name = "project_role_id")
    private ProjectRole role;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    @Column(columnDefinition = "TEXT")
    private String applicationMessage;

    @Column(columnDefinition = "TEXT")
    private String reviewComment;

    // 투입 가능 일자
    @Column(nullable = false)
    private LocalDate availableStartDate;

    /** 참여 가능 시간
     * 용도: 구조화된 시간 정보 저장
     * 저장 형식: "평일: 17:00~22:00, 주말: 09:00~21:00"
     * 활용: 팀 회의 시간 조율, 작업 분배 계획
     */
    private String available_time_slots;

    /**
     * 용도: 추가적인 시간 관련 설명
     * 저장 내용: "시험 기간(12월) 제외", "목요일 저녁 회의 참석 가능" 등
     * 활용: 예외 상황이나 특별한 요구사항 관리
     */
    private String time_preference_note;

    // 지원 일자
    @Column(nullable = false)
    private LocalDateTime appliedAt;

    // 검토 일시
    private LocalDateTime reviewedAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;


    // ======팩토리 메서드=======
    public static ProjectApplication create(Project project, Member member, ProjectRole role,
                                            String applicationMessage, LocalDate availableStartDate,
                                            String availableTimeSlots, String timePreferenceNote) {
        return ProjectApplication.builder()
                .project(project)
                .member(member)
                .role(role)
                .status(ApplicationStatus.PENDING)
                .applicationMessage(applicationMessage)
                .availableStartDate(availableStartDate)
                .available_time_slots(availableTimeSlots)
                .time_preference_note(timePreferenceNote)
                .appliedAt(LocalDateTime.now())
                .build();
    }
    // ======비즈니스 메서드=======
    public void updateStatus(ApplicationStatus newStatus) {
        this.status = newStatus;
    }

    public void updateApplication(String applicationMessage, LocalDate availableStartDate, 
                                String availableTimeSlots, String timePreferenceNote) {
        if (applicationMessage != null) {
            this.applicationMessage = applicationMessage;
        }
        if (availableStartDate != null) {
            this.availableStartDate = availableStartDate;
        }
        if (availableTimeSlots != null) {
            this.available_time_slots = availableTimeSlots;
        }
        if (timePreferenceNote != null) {
            this.time_preference_note = timePreferenceNote;
        }
    }
}
