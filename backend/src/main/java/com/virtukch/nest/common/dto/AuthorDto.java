package com.virtukch.nest.common.dto;

import com.virtukch.nest.member.model.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class AuthorDto {
    private Long id;
    private String name;
    private String memberImageUrl;

    public static AuthorDto create(Member member) {
        return AuthorDto.builder()
                .id(member.getMemberId())
                .name(member.getMemberName())
                .memberImageUrl(member.getMemberImageUrl())
                .build();
    }
}
