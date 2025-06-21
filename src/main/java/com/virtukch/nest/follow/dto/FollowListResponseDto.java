package com.virtukch.nest.follow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class FollowListResponseDto {
    
    private List<FollowUserDto> users;
    private Integer totalCount;
    private String message;
    
    // 팩토리 메서드 - 팔로잉 목록용
    public static FollowListResponseDto forFollowing(List<FollowUserDto> users) {
        return FollowListResponseDto.builder()
                .users(users)
                .totalCount(users.size())
                .message("팔로잉 목록을 성공적으로 조회했습니다.")
                .build();
    }
    
    // 팩토리 메서드 - 팔로워 목록용
    public static FollowListResponseDto forFollowers(List<FollowUserDto> users) {
        return FollowListResponseDto.builder()
                .users(users)
                .totalCount(users.size())
                .message("팔로워 목록을 성공적으로 조회했습니다.")
                .build();
    }
}
