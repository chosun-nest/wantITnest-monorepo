package com.virtukch.nest.follow.dto;

import com.virtukch.nest.follow.model.Follow;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class FollowResponseDto {
    
    private Long id;
    private Long followerId;
    private Long followingId;
    private LocalDateTime createdAt;
    private String message;
    
    // 팩토리 메서드
    public static FollowResponseDto from(Follow follow) {
        return FollowResponseDto.builder()
                .id(follow.getId())
                .followerId(follow.getFollowerId())
                .followingId(follow.getFollowingId())
                .createdAt(follow.getCreatedAt())
                .message("팔로우가 완료되었습니다.")
                .build();
    }
}
