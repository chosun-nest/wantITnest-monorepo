package com.virtukch.nest.project.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RoleApplicationSummaryDto {
    private Long roleId;
    private String roleName;
    private Integer totalApplications;
    private Integer pendingApplications;
    private Integer acceptedApplications;
    private Double averageTechStackMatch;
}
