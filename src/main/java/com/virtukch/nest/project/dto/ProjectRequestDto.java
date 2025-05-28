package com.virtukch.nest.project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

import java.util.List;

@Getter
public class ProjectRequestDto {
    @NotBlank(message = "모집글 제목은 비어 있을 수 없습니다.")
    private String projectTitle;
    private String projectDescription;
    private int maxMember;
    private boolean isRecruiting;
    private List<String> tags;
}
