package com.virtukch.nest.member.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long memberId;

    @Column(unique = true, nullable = false)
    private String memberEmail;

    @Column(nullable = false)
    private String memberPassword;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role memberRole;

    private String memberName;

    private String memberSnsUrl1;

    private String memberSnsUrl2;

    private String memberSnsUrl3;

    private String memberSnsUrl4;

    @Column(columnDefinition = "TINYINT(1)", nullable = false)
    private Boolean memberIsStudent;

    @Builder
    public Member(String memberEmail, String memberPassword, Role memberRole,
        String memberName, String memberSnsUrl1, String memberSnsUrl2,
        String memberSnsUrl3, String memberSnsUrl4, boolean memberIsStudent) {
        this.memberEmail = memberEmail;
        this.memberPassword = memberPassword;
        this.memberRole = memberRole;
        this.memberName = memberName;
        this.memberSnsUrl1 = memberSnsUrl1;
        this.memberSnsUrl2 = memberSnsUrl2;
        this.memberSnsUrl3 = memberSnsUrl3;
        this.memberSnsUrl4 = memberSnsUrl4;
        this.memberIsStudent = memberIsStudent;
    }
}
