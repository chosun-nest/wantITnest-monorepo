package com.virtukch.nest.project_member.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProjectMemberDecisionRequestDto {
    private Long projectMemberId; // 승인/거절 대상 슬롯 ID
    private boolean approve;      // true: 승인, false: 거절
}
