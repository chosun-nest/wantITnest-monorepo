package com.virtukch.nest.auth.dto;

import io.swagger.v3.oas.annotations.Parameter;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LogoutRequestDto {
    @Parameter(description = "Access Token")
    private String accessToken;

    @Parameter(description = "Refresh Token")
    private String refreshToken;
}
