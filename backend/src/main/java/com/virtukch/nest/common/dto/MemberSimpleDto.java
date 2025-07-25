package com.virtukch.nest.common.dto;

import com.virtukch.nest.member.model.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class MemberSimpleDto {
    private Long id;
    private String name;
    private String memberImageUrl;

    public static MemberSimpleDto create(Member member) {
        // Member가 null인 경우 탈퇴한 사용자로 처리
        if (member == null) {
            return MemberSimpleDto.builder()
                    .id(null)
                    .name("탈퇴한 사용자")
                    .memberImageUrl(null)
                    .build();
        }

        return MemberSimpleDto.builder()
                .id(member.getMemberId())
                .name(member.getMemberName())
                .memberImageUrl(member.getMemberImageUrl())
                .build();
    }
}
