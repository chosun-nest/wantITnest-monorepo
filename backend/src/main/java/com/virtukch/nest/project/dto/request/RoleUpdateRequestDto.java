package com.virtukch.nest.project.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;

import java.util.List;

@Getter
public class RoleUpdateRequestDto {
    @NotBlank(message = "역할 이름은 공란일 수 없습니다.")
    @NotNull(message = "역할 이름은 null일 수 없습니다.")
    @Size(min = 2, max = 20, message = "역할 이름은 최소 2자, 최대 20자여야 합니다.")
    private String roleName;

    private String roleDescription;
    private String additionalRequirements;

    @Positive(message = "필요 인원 수는 음수 일 수 없습니다.")
    private Integer requiredCount;
    private List<RoleTechStackRequestDto> techStacks;
}
