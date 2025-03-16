package com.virtukch.nest.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class SignupResponseDto {
    private Long memberId;
    private String email;
    private String accessToken;
    private String refreshToken;
}
