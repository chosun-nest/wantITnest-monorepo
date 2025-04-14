package com.virtukch.nest.member.config;

import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.member.model.Role;
import com.virtukch.nest.member.repository.MemberRepository;
import com.virtukch.nest.member_department.model.MemberDepartment;
import com.virtukch.nest.member_department.repository.MemberDepartmentRepository;
import com.virtukch.nest.member_interest.model.MemberInterest;
import com.virtukch.nest.member_interest.repository.MemberInterestRepository;
import com.virtukch.nest.member_tech_stack.model.MemberTechStack;
import com.virtukch.nest.member_tech_stack.repostitory.MemberTechStackRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MemberDataLoader implements ApplicationRunner {

    // 1. 순수 회원가입
    private final PasswordEncoder passwordEncoder;
    private final MemberRepository memberRepository;

    // 2. 학과
    private final MemberDepartmentRepository memberDepartmentRepository;

    // 3. 관심분야
    private final MemberInterestRepository memberInterestRepository;

    // 4. 기술스택
    private final MemberTechStackRepository memberTechStackRepository;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        Member member = Member.builder()
            .memberEmail("kch4731@naver.com")
            .memberPassword(passwordEncoder.encode("kch4731@naver.com")) // 실제로는 BCrypt 등으로 암호화 필요
            .memberRole(Role.ROLE_USER)
            .memberName("김채호")
            .memberSnsUrl1("https://github.com/VIRTUKCH/")
            .memberSnsUrl2("https://www.instagram.com/chaeihou/")
            .memberSnsUrl3(null)
            .memberSnsUrl4(null)
            .memberIsStudent(true)
            .memberIntroduce("안녕하세요! 컴퓨터공학 전공 중입니다.")
            .memberImageUrl("http://119.219.30.209/images/nest/kch4731@naver.com")
            .build();

        memberRepository.save(member);

        List<MemberDepartment> memberDepartmentList = List.of(
            MemberDepartment.builder().memberId(member.getMemberId()).departmentId(1L).build(),
            MemberDepartment.builder().memberId(member.getMemberId()).departmentId(2L).build(),
            MemberDepartment.builder().memberId(member.getMemberId()).departmentId(3L).build()
        );

        memberDepartmentRepository.saveAll(memberDepartmentList);

        List<MemberTechStack> memberTechStackList = List.of(
            MemberTechStack.builder().memberId(member.getMemberId()).techStackId(1L).build(),
            MemberTechStack.builder().memberId(member.getMemberId()).techStackId(2L).build(),
            MemberTechStack.builder().memberId(member.getMemberId()).techStackId(3L).build()
        );

        memberTechStackRepository.saveAll(memberTechStackList);

        List<MemberInterest> memberInterestList = List.of(
            MemberInterest.builder().memberId(member.getMemberId()).interestId(1L).build(),
            MemberInterest.builder().memberId(member.getMemberId()).interestId(2L).build(),
            MemberInterest.builder().memberId(member.getMemberId()).interestId(3L).build()
        );

        memberInterestRepository.saveAll(memberInterestList);
    }
}
