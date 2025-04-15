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

    private String memberIntroduce;

    private String memberImageUrl;

    @Builder
    public Member(String memberEmail, String memberPassword, Role memberRole,
        String memberName, String memberSnsUrl1, String memberSnsUrl2,
        String memberSnsUrl3, String memberSnsUrl4, boolean memberIsStudent, String memberIntroduce,
        String memberImageUrl) {
        this.memberEmail = memberEmail;
        this.memberPassword = memberPassword;
        this.memberRole = memberRole;
        this.memberName = memberName;
        this.memberSnsUrl1 = memberSnsUrl1;
        this.memberSnsUrl2 = memberSnsUrl2;
        this.memberSnsUrl3 = memberSnsUrl3;
        this.memberSnsUrl4 = memberSnsUrl4;
        this.memberIsStudent = memberIsStudent;
        this.memberIntroduce = memberIntroduce;
        this.memberImageUrl = memberImageUrl;
    }

    public void updateEmail(String memberEmail) {
        this.memberEmail = memberEmail;
    }

    public void updatePassword(String memberPassword) {
        this.memberPassword = memberPassword;
    }

    public void updateRole(Role memberRole) {
        this.memberRole = memberRole;
    }

    public void updateName(String memberName) {
        this.memberName = memberName;
    }

    public void updateSnsUrl1(String url) {
        this.memberSnsUrl1 = url;
    }

    public void updateSnsUrl2(String url) {
        this.memberSnsUrl2 = url;
    }

    public void updateSnsUrl3(String url) {
        this.memberSnsUrl3 = url;
    }

    public void updateSnsUrl4(String url) {
        this.memberSnsUrl4 = url;
    }

    public void updateIsStudent(Boolean isStudent) {
        this.memberIsStudent = isStudent;
    }

    public void updateIntroduce(String introduce) {
        this.memberIntroduce = introduce;
    }

    public void updateImageUrl(String imageUrl) {
        this.memberImageUrl = imageUrl;
    }
}
