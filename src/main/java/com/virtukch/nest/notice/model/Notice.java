package com.virtukch.nest.notice.model;

import com.virtukch.nest.common.model.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "notice")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class Notice extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "number", nullable = false)
    private Long number;

    @Column(name = "notice_type", nullable = false)
    private String noticeType;  // 학사공지, 장학공지, 컴퓨터공학과 공지 등

    @Column(nullable = false)
    private String title;

    private String writer;

    @Column(name = "post_date")
    private String postDate;

    @Column(columnDefinition = "TEXT")
    private String link;

    private String  views;

    private LocalDate deadline; // 장학공지일 때만
}