package com.virtukch.nest.member.controller;

import com.virtukch.nest.member.dto.MemberResponseDto;
import com.virtukch.nest.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/me")
    public ResponseEntity<MemberResponseDto> getMemberInfo(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(memberService.getMemberInfo(email));
    }
}
