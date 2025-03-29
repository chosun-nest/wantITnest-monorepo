package com.virtukch.nest.notice.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "notice")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Notice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long noticeId;
    private String noticeTitle;
    private String noticeWriter;
    private String noticeContent;
    private String noticeCreatedAt;
    private String noticeSource;
    private String noticeUpdatedAt;
}