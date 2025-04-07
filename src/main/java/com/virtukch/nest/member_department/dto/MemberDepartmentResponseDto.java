package com.virtukch.nest.member_department.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MemberDepartmentResponseDto {

    private Long memberId;

    private Long departmentId;

    private String departmentName;
}
