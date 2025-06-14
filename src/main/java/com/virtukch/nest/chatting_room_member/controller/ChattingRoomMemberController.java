package com.virtukch.nest.chatting_room_member.controller;

import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.chatting_room_member.dto.ChattingRoomMemberRequestDto;
import com.virtukch.nest.chatting_room_member.service.ChattingRoomMemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/chatting-room-member")
@RequiredArgsConstructor
public class ChattingRoomMemberController {

    private final ChattingRoomMemberService chattingRoomMemberService;

    @PostMapping
    @Operation(
        summary = "채팅방 입장",
        description = "사용자가 채팅방에 입장합니다.",
        security = @SecurityRequirement(name = "bearerAuth"),
        responses = {
            @ApiResponse(responseCode = "200", description = "입장 성공")
        }
    )
    public ResponseEntity<Void> registerChattingRoomMember(
        @RequestBody ChattingRoomMemberRequestDto chattingRoomMemberRegisterOrRemoveRequestDto,
        @Parameter(hidden = true)
        @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        chattingRoomMemberService.registerChattingRoomMember(
            chattingRoomMemberRegisterOrRemoveRequestDto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    @Operation(
        summary = "채팅방 퇴장",
        description = "사용자가 채팅방에서 퇴장합니다.",
        security = @SecurityRequirement(name = "bearerAuth"),
        responses = {
            @ApiResponse(responseCode = "200", description = "퇴장 성공")
        }
    )
    public ResponseEntity<Void> removeChattingRoomMember(
        @RequestBody ChattingRoomMemberRequestDto chattingRoomMemberRegisterOrRemoveRequestDto,
        @Parameter(hidden = true)
        @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        chattingRoomMemberService.removeChattingRoomMember(
            chattingRoomMemberRegisterOrRemoveRequestDto);
        return ResponseEntity.ok().build();
    }
}
