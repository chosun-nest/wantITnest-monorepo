package com.virtukch.nest.member.dto;

import lombok.Getter;

@Getter
public class MemberPasswordChangeRequestDto {

    private String currentPassword;     // 현재 비밀번호
    private String newPassword;         // 새 비밀번호
    private String newPasswordConfirm;  // 새 비밀번호 확인
}