package com.virtukch.nest.project.dto.response;

import java.util.List;

// 역할 관리용 (팀장에게만 보이는 정보)
public class RoleManagementDto {
    private RoleDetailDto roleInfo;
    private Integer pendingApplicationCount; // 대기중인 지원서 수
    private List<ApplicationSimpleDto> recentApplications;
}
