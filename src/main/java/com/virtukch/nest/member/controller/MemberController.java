package com.virtukch.nest.member.controller;

import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.member.dto.MemberCheckPasswordRequestDto;
import com.virtukch.nest.member.dto.MemberImageUploadResponseDto;
import com.virtukch.nest.member.dto.MemberPasswordChangeRequestDto;
import com.virtukch.nest.member.dto.MemberResponseDto;
import com.virtukch.nest.member.dto.MemberUpdateRequestDto;
import com.virtukch.nest.member.dto.MemberCheckPasswordResponseDto;
import com.virtukch.nest.member.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/members")
@RequiredArgsConstructor
@Tag(name = "Member API", description = "회원 정보 관련 API")
public class MemberController {

    private final MemberService memberService;

    @Operation(
        summary = "회원 정보 조회",
        description = """
                현재 로그인한 사용자의 정보를 DB 에서 조회하여 상세하게 반환합니다.
                이 API 는 `/auth/me` 와는 달리 데이터베이스에 접근하며,
                이메일, 권한, 식별자 등 보다 풍부한 회원 정보를 제공합니다.
            """
    )
    @GetMapping("/me")
    public ResponseEntity<MemberResponseDto> getMemberInfo(
        @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        return ResponseEntity.ok(
            memberService.getCurrentMemberByCustomUserDetails(customUserDetails));
    }

    @PatchMapping("/me")
    @Operation(summary = "회원 정보 수정", description = "변경하고자 하는 필드만 포함하여 전송하세요. 미포함된 필드는 기존 값을 유지합니다.")
    public ResponseEntity<MemberResponseDto> updateMemberInfo(
        @AuthenticationPrincipal CustomUserDetails customUserDetails,
        @RequestBody MemberUpdateRequestDto memberUpdateRequestDto) {
        return ResponseEntity.ok(
            memberService.updateMemberInfo(customUserDetails, memberUpdateRequestDto));
    }

    @PatchMapping("/me/password")
    @Operation(summary = "비밀번호 변경", description = "현재 비밀번호 확인 후 새 비밀번호로 변경합니다.")
    public ResponseEntity<Void> changePassword(
        @AuthenticationPrincipal CustomUserDetails customUserDetails,
        @RequestBody MemberPasswordChangeRequestDto memberPasswordChangeRequestDto
    ) {
        memberService.changePassword(customUserDetails, memberPasswordChangeRequestDto);
        return ResponseEntity.noContent().build(); // 성공 시 응답 바디 없음
    }

    @PostMapping("/me/image")
    @Operation(
        summary = "프로필 이미지 업로드",
        description = """
        사용자의 프로필 이미지를 업로드합니다.

        ✅ 요청 방법:
        - HTTP Method: `POST`
        - 요청 URL: `/api/v1/members/me/image`
        - 헤더: `Authorization: Bearer {access_token}`
        - 바디 형식: `multipart/form-data`
            - Key: `file`
            - Value: 이미지 파일 (예: PNG, JPG)

        ✅ 요청 예시 (Postman 등에서):
        - Headers 탭에 토큰 추가
        - Body 탭을 `form-data`로 설정
            - key = `file`
            - type = `File`
            - value = 업로드할 이미지 파일

        ✅ 응답 예시:
        ```json
        {
          "imageUrl": "/uploaded-images/member_1/f66f14c3-13eb-4298-a294-308cb1faee45.jpeg"
        }
        ```

        ✅ 이후 이미지 사용하는 법:
        - 위에서 받은 `imageUrl`을 그대로 브라우저에서 요청하면 이미지에 접근할 수 있습니다.
        - 예: `http://119.219.30.209:6030/uploaded-images/member_1/f66f14c3-13eb-4298-a294-308cb1faee45.jpeg`

        ⚠️ 이미지 업로드 시 기존 이미지가 자동으로 삭제되며, 새 이미지로 교체됩니다.
    """
    )
    public ResponseEntity<MemberImageUploadResponseDto> uploadProfileImage(
        @AuthenticationPrincipal CustomUserDetails customUserDetails,
        @RequestPart("file") MultipartFile file
    ) {
        String imageUrl = memberService.uploadProfileImage(customUserDetails, file);
        return ResponseEntity.ok(MemberImageUploadResponseDto.builder().imageUrl(imageUrl).build());
    }

    @DeleteMapping("/me")
    @Operation(summary = "회원 탈퇴", description = "로그인된 사용자가 자신의 계정을 삭제합니다.")
    public ResponseEntity<Void> deleteMember(
        @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        memberService.deleteMember(customUserDetails);
        return ResponseEntity.noContent().build();
    }

    @Operation(
        summary = "비밀번호 확인",
        description = """
            사용자가 입력한 현재 비밀번호가 맞는지 확인합니다. 
            민감한 정보 변경(예: 비밀번호 변경, 탈퇴 등) 전에 호출해 사용할 수 있습니다.
            """)
    @PostMapping("/check-password")
    public ResponseEntity<MemberCheckPasswordResponseDto> checkPassword(
        @AuthenticationPrincipal CustomUserDetails customUserDetails,
        @RequestBody MemberCheckPasswordRequestDto memberCheckPasswordRequestDto
    ) {
        boolean result = memberService.checkPassword(customUserDetails,
            memberCheckPasswordRequestDto.getPassword());
        if (result) {
            return ResponseEntity.ok(new MemberCheckPasswordResponseDto("비밀번호가 일치합니다."));
        } else {
            return ResponseEntity.status(401)
                .body(new MemberCheckPasswordResponseDto("비밀번호가 일치하지 않습니다."));
        }
    }
}
