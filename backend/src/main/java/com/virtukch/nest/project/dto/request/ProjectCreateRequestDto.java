package com.virtukch.nest.project.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class ProjectCreateRequestDto {
    @NotBlank(message = "모집글 제목은 비어 있을 수 없습니다.")
    private String projectTitle;
    private String projectDescription;

    private LocalDateTime recruitmentEndDate;
    private LocalDateTime projectStartDate;
    private LocalDateTime projectEndDate;

    private Integer creatorRoleIndex;
    private List<RoleCreateRequestDto> roles;

    private List<String> tags;
}
