package com.virtukch.nest.follow.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class FollowRequestDto {
    
    @NotNull(message = "팔로우할 회원 ID는 필수입니다.")
    @Positive(message = "팔로우할 회원 ID는 양수여야 합니다.")
    private Long followingId;
}