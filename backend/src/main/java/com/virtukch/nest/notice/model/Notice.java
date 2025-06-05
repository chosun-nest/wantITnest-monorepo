package com.virtukch.nest.notice.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "notice")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
@Builder
public class Notice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long number;

    @Column(nullable = false)
    private String noticeType;  // 학사공지, 장학공지, 컴퓨터공학과 공지 등

    @Column(nullable = false)
    private String title;

    private String writer;

    @Column(nullable = false)
    private LocalDate postDate;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String link;

    private Long  views;

    private String deadline; // 장학공지일 때만

    @CreatedDate
    @Column(nullable = false, updatable = false)
    protected LocalDateTime crawledAt;
}