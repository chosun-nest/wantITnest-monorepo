package com.virtukch.nest.follow.dto;

import com.virtukch.nest.member.model.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class FollowUserDto {
    
    private Long memberId;
    private String memberName;
    private String memberImageUrl;
    private String memberIntroduce;
    private Boolean memberIsStudent;
    private LocalDateTime followedAt;
    
    // 팩토리 메서드 - Member와 팔로우 시간으로 생성
    public static FollowUserDto from(Member member, LocalDateTime followedAt) {
        return FollowUserDto.builder()
                .memberId(member.getMemberId())
                .memberName(member.getMemberName())
                .memberImageUrl(member.getMemberImageUrl())
                .memberIntroduce(member.getMemberIntroduce())
                .memberIsStudent(member.getMemberIsStudent())
                .followedAt(followedAt)
                .build();
    }
}
