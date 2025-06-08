package com.virtukch.nest.member.service;

import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.common.exception.ImageDirectoryCreationException;
import com.virtukch.nest.common.exception.ImageUploadFailedException;
import com.virtukch.nest.member.dto.MemberPasswordChangeRequestDto;
import com.virtukch.nest.member.dto.MemberResponseDto;
import com.virtukch.nest.member.dto.MemberUpdateRequestDto;
import com.virtukch.nest.member.exception.MemberNotFoundException;
import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.member.repository.MemberRepository;
import com.virtukch.nest.member_department.dto.MemberDepartmentResponseDto;
import com.virtukch.nest.member_department.service.MemberDepartmentService;
import com.virtukch.nest.member_interest.dto.MemberInterestResponseDto;
import com.virtukch.nest.member_interest.service.MemberInterestService;
import com.virtukch.nest.member_tech_stack.dto.MemberTechStackResponseDto;
import com.virtukch.nest.member_tech_stack.service.MemberTechStackService;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
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

//        List<MemberInterestResponseDto> memberInterestResponseDtoList = memberInterestService.findByMemberId(
//            memberId);
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
            .memberPasswordLength(member.getMemberPasswordLength())
//            .memberInterestResponseDtoList(memberInterestResponseDtoList)
            .memberDepartmentResponseDtoList(memberDepartmentResponseDtoList)
            .memberTechStackResponseDtoList(memberTechStackResponseDtoList)
            .build();
    }

    public MemberResponseDto findByMemberId(Long memberId) {
        Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new RuntimeException("User not found"));

//        List<MemberInterestResponseDto> memberInterestResponseDtoList = memberInterestService.findByMemberId(
//            memberId);
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
            .memberPasswordLength(member.getMemberPasswordLength())
            .memberInterestResponseDtoList(memberInterestResponseDtoList)
            .memberDepartmentResponseDtoList(memberDepartmentResponseDtoList)
            .memberTechStackResponseDtoList(memberTechStackResponseDtoList)
            .build();
    }

    @Transactional
    public MemberResponseDto updateMemberInfo(CustomUserDetails customUserDetails,
        MemberUpdateRequestDto dto) {
        Long memberId = customUserDetails.getMember().getMemberId();

        // 1. 기존 회원 엔티티 조회
        Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new IllegalArgumentException("해당 회원이 존재하지 않습니다."));

        // 2. null 이 아닌 값만 선택적으로 덮어쓰기\
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

        // 2-1. 연관된 정보 업데이트
        if (dto.getMemberInterestUpdateRequestIdList() != null) {
            memberInterestService.updateMemberInterests(memberId,
                dto.getMemberInterestUpdateRequestIdList());
        }
        if (dto.getMemberDepartmentUpdateRequestIdList() != null) {
            memberDepartmentService.updateMemberDepartments(memberId,
                dto.getMemberDepartmentUpdateRequestIdList());
        }
        if (dto.getMemberTechStackUpdateRequestIdList() != null) {
            memberTechStackService.updateMemberTechStacks(memberId,
                dto.getMemberTechStackUpdateRequestIdList());
        }

        // 3. 변경 사항 저장 (영속성 컨텍스트 + @Transactional 이면 자동으로 반영됨)
        memberRepository.save(member);

        // 4. 최신 정보 기준으로 응답 Dto 생성
        return MemberResponseDto.builder()
            .memberName(member.getMemberName())
            .memberSnsUrl1(member.getMemberSnsUrl1())
            .memberSnsUrl2(member.getMemberSnsUrl2())
            .memberSnsUrl3(member.getMemberSnsUrl3())
            .memberSnsUrl4(member.getMemberSnsUrl4())
            .memberIsStudent(member.getMemberIsStudent())
            .memberIntroduce(member.getMemberIntroduce())
            .memberImageUrl(member.getMemberImageUrl())
//            .memberInterestResponseDtoList(memberInterestService.findByMemberId(memberId))
            .memberDepartmentResponseDtoList(memberDepartmentService.findByMemberId(memberId))
            .memberTechStackResponseDtoList(memberTechStackService.findByMemberId(memberId))
            .build();
    }

    @Transactional
    public void changePassword(CustomUserDetails customUserDetails,
        MemberPasswordChangeRequestDto dto) {
        Long memberId = customUserDetails.getMember().getMemberId();

        Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new IllegalArgumentException("회원 정보를 찾을 수 없습니다."));

        // 1. 현재 비밀번호 검증
        if (!passwordEncoder.matches(dto.getCurrentPassword(), member.getMemberPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }

        // 2. 새 비밀번호 확인 일치 검증
        if (!dto.getNewPassword().equals(dto.getNewPasswordConfirm())) {
            throw new IllegalArgumentException("새 비밀번호와 확인이 일치하지 않습니다.");
        }

        // 3. (선택) 새 비밀번호 형식 유효성 검증
        if (!isValidPasswordFormat(dto.getNewPassword())) {
            throw new IllegalArgumentException("비밀번호 형식이 올바르지 않습니다.");
        }

        // 4. 비밀번호 업데이트 (JPA 의 Dirty Check 에 의해 실제로 업데이트 됨)
        member.updatePassword(passwordEncoder.encode(dto.getNewPassword()));
        member.updatePasswordLength(dto.getNewPassword().length());
    }

    private boolean isValidPasswordFormat(String password) {
        if (password.length() < 8 || password.length() > 32) {
            return false;
        }
        if (password.matches(".*(.)\\1{2,}.*")) {
            return false; // 연속 3자 이상
        }
        int types = 0;
        if (password.matches(".*[a-zA-Z].*")) {
            types++;
        }
        if (password.matches(".*[0-9].*")) {
            types++;
        }
        if (password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\",.<>/?].*")) {
            types++;
        }
        return types >= 2;
    }

    @Transactional
    public void deleteMember(CustomUserDetails customUserDetails) {
        Long memberId = customUserDetails.getMember().getMemberId();

        // 연관된 관심사, 학과, 기술스택 먼저 삭제
        memberInterestService.deleteByMemberId(memberId);
        memberDepartmentService.deleteByMemberId(memberId);
        memberTechStackService.deleteByMemberId(memberId);

        // 회원 자체 삭제
        memberRepository.deleteById(memberId);
    }

    public String uploadProfileImage(CustomUserDetails customUserDetails, MultipartFile file) {
        Long memberId = customUserDetails.getMember().getMemberId();
        Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new MemberNotFoundException("Member not found."));

        // 1. 사용자별 디렉토리 생성
        String baseDir = new File("uploaded-images").getAbsolutePath();
        File userDir = new File(baseDir, "member_" + memberId);
        if (!userDir.exists() && !userDir.mkdirs()) {
            throw new ImageDirectoryCreationException(userDir.getPath());
        }

        // 2. 기존 이미지 삭제 (같은 폴더 내)
        String prevImageUrl = member.getMemberImageUrl();
        if (prevImageUrl != null && prevImageUrl.startsWith("/uploaded-images/")) {
            String cleanedPath = prevImageUrl.substring("/uploaded-images/".length());
            File prevFile = new File(baseDir + File.separator + cleanedPath);
            try {
                Files.delete(prevFile.toPath());
            } catch (IOException e) {
                log.error("이전 프로필 이미지 삭제 실패: {}", prevFile.getAbsolutePath(), e);
            }
        }

        // 3. 저장 파일명 구성 (UUID + 확장자)
        String originalFilename = file.getOriginalFilename();
        if (!originalFilename.contains(".")) {
            throw new IllegalArgumentException("파일명이 유효하지 않습니다.");
        }
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String filename = UUID.randomUUID() + extension;
        File dest = new File(userDir, filename);

        try {
            file.transferTo(dest);
        } catch (Exception e) {
            throw new ImageUploadFailedException("이미지 저장 중 오류 발생", e);
        }

        // 4. 이미지 URL 저장
        String imageUrl = "/uploaded-images/member_" + memberId + "/" + filename;
        member.updateImageUrl(imageUrl);
        memberRepository.save(member);
        return imageUrl;
    }

    public boolean checkPassword(CustomUserDetails customUserDetails, String inputPassword) {
        Long memberId = customUserDetails.getMember().getMemberId();

        Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new MemberNotFoundException("회원 정보를 찾을 수 없습니다."));

        return passwordEncoder.matches(inputPassword, member.getMemberPassword());
    }
}