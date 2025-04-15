package com.virtukch.nest.member.service;

import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.member.dto.MemberResponseDto;
import com.virtukch.nest.member.dto.MemberUpdateRequestDto;
import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.member.repository.MemberRepository;
import com.virtukch.nest.member_department.dto.MemberDepartmentResponseDto;
import com.virtukch.nest.member_department.service.MemberDepartmentService;
import com.virtukch.nest.member_interest.dto.MemberInterestResponseDto;
import com.virtukch.nest.member_interest.service.MemberInterestService;
import com.virtukch.nest.member_tech_stack.dto.MemberTechStackResponseDto;
import com.virtukch.nest.member_tech_stack.service.MemberTechStackService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final MemberInterestService memberInterestService;
    private final MemberDepartmentService memberDepartmentService;
    private final MemberTechStackService memberTechStackService;

    // CustomUserDetails 기반으로 현재 로그인한 회원 정보 반환 + 프로필 정보 확인 위한 최대한의 많은 정보 포함
    public MemberResponseDto getCurrentMemberByCustomUserDetails(
        CustomUserDetails customUserDetails) {

        // Token 의 Claims 에는 memberId 만 들어 있습니다.
        Long memberId = customUserDetails.getMember().getMemberId();

        // DB 를 조회해야 하는데, customUserDetails 의 member 는 Spring Security 가 인증 시점에 생성한 일종의 스냅샷 객체에 불과하기 때문에, 꼭 최신 정보가 들어있다고 확신하기 어렵기 때문입니다.
        Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        List<MemberInterestResponseDto> memberInterestResponseDtoList = memberInterestService.findByMemberId(
            memberId);
        List<MemberDepartmentResponseDto> memberDepartmentResponseDtoList = memberDepartmentService.findByMemberId(
            memberId);
        List<MemberTechStackResponseDto> memberTechStackResponseDtoList = memberTechStackService.findByMemberId(
            memberId);

        return MemberResponseDto.builder()
            .memberId(member.getMemberId())
            .memberEmail(member.getMemberEmail())
            .memberRole(member.getMemberRole())
            .memberName(member.getMemberName())
            .memberSnsUrl1(member.getMemberSnsUrl1())
            .memberSnsUrl2(member.getMemberSnsUrl2())
            .memberSnsUrl3(member.getMemberSnsUrl3())
            .memberSnsUrl4(member.getMemberSnsUrl4())
            .memberIsStudent(member.getMemberIsStudent())
            .memberIntroduce(member.getMemberIntroduce())
            .memberImageUrl(member.getMemberImageUrl())
            .memberInterestResponseDtoList(memberInterestResponseDtoList)
            .memberDepartmentResponseDtoList(memberDepartmentResponseDtoList)
            .memberTechStackResponseDtoList(memberTechStackResponseDtoList)
            .build();
    }

    @Transactional
    public MemberResponseDto updateMemberInfo(CustomUserDetails customUserDetails, MemberUpdateRequestDto dto) {
        Long memberId = customUserDetails.getMember().getMemberId();

        // 1. 기존 회원 엔티티 조회
        Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new IllegalArgumentException("해당 회원이 존재하지 않습니다."));

        // 2. null 이 아닌 값만 선택적으로 덮어쓰기
        if (dto.getMemberEmail() != null) {
            member.updateEmail(dto.getMemberEmail());
        }
        if (dto.getMemberRole() != null) {
            member.updateRole(dto.getMemberRole());
        }
        if (dto.getMemberName() != null) {
            member.updateName(dto.getMemberName());
        }
        if (dto.getMemberSnsUrl1() != null) {
            member.updateSnsUrl1(dto.getMemberSnsUrl1());
        }
        if (dto.getMemberSnsUrl2() != null) {
            member.updateSnsUrl2(dto.getMemberSnsUrl2());
        }
        if (dto.getMemberSnsUrl3() != null) {
            member.updateSnsUrl3(dto.getMemberSnsUrl3());
        }
        if (dto.getMemberSnsUrl4() != null) {
            member.updateSnsUrl4(dto.getMemberSnsUrl4());
        }
        if (dto.getMemberIsStudent() != null) {
            member.updateIsStudent(dto.getMemberIsStudent());
        }
        if (dto.getMemberIntroduce() != null) {
            member.updateIntroduce(dto.getMemberIntroduce());
        }
        if (dto.getMemberImageUrl() != null) {
            member.updateImageUrl(dto.getMemberImageUrl());
        }

        // 3. 변경 사항 저장 (영속성 컨텍스트 + @Transactional 이면 자동으로 반영됨)
        memberRepository.save(member);

        // 4. 최신 정보 기준으로 응답 Dto 생성
        return MemberResponseDto.builder()
            .memberId(member.getMemberId())
            .memberEmail(member.getMemberEmail())
            .memberRole(member.getMemberRole())
            .memberName(member.getMemberName())
            .memberSnsUrl1(member.getMemberSnsUrl1())
            .memberSnsUrl2(member.getMemberSnsUrl2())
            .memberSnsUrl3(member.getMemberSnsUrl3())
            .memberSnsUrl4(member.getMemberSnsUrl4())
            .memberIsStudent(member.getMemberIsStudent())
            .memberIntroduce(member.getMemberIntroduce())
            .memberImageUrl(member.getMemberImageUrl())
            .memberInterestResponseDtoList(memberInterestService.findByMemberId(memberId))
            .memberDepartmentResponseDtoList(memberDepartmentService.findByMemberId(memberId))
            .memberTechStackResponseDtoList(memberTechStackService.findByMemberId(memberId))
            .build();
    }
}