package com.virtukch.nest.history.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class History {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long historyId;

    private Long memberId;        // 연관관계 없이 ID만 보유

    private String content;       // 활동 내용

    private LocalDate startDate;  // 시작일

    private LocalDate endDate;    // 종료일

    private boolean important;    // 별 표시 여부
}