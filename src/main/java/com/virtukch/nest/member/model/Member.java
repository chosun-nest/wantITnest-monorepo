package com.virtukch.nest.member.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long memberId;  // ✅ ID 필드명 변경

    @Column(unique = true, nullable = false)
    private String memberEmail;  // ✅ 이메일 필드명 변경

    @Column(nullable = false)
    private String memberPassword;  // ✅ 비밀번호 필드명 변경

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role memberRole;  // ✅ 역할 필드 추가

    @Builder
    public Member(String memberEmail, String memberPassword, Role memberRole) {  // ✅ 생성자 파라미터 수정
        this.memberEmail = memberEmail;
        this.memberPassword = memberPassword;
        this.memberRole = memberRole;
    }
}
