package com.virtukch.nest.chatting_room.controller;

import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.chatting_room.dto.ChattingRoomRequestDto;
import com.virtukch.nest.chatting_room.dto.ChattingRoomResponseDto;
import com.virtukch.nest.chatting_room.service.ChattingRoomService;
import com.virtukch.nest.chatting_room_member.service.ChattingRoomMemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/chatting-room")
@RequiredArgsConstructor
public class ChattingRoomController {

    private final ChattingRoomService chattingRoomService;
    private final ChattingRoomMemberService chattingRoomMemberService;

    @Operation(
        summary = "내 채팅방 목록 조회",
        description = "인증된 사용자가 속한 채팅방의 ID 리스트를 기준으로, 각 채팅방 정보를 반환합니다.",
        security = @SecurityRequirement(name = "bearerAuth"),
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "채팅방 목록 조회 성공",
                content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = ChattingRoomResponseDto.class)
                )
            )
        }
    )
    // 내가 속한 채팅방(ChattingRoom.java)을 모두 가져옵니다
    @GetMapping("/me")
    public ResponseEntity<List<ChattingRoomResponseDto>> findMyChattingRoomAndChattingRoomMemberList(
        @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long memberId = customUserDetails.getMember().getMemberId();

        List<Long> chattingRoomIdList = chattingRoomMemberService.findChattingRoomIdListByMemberId(
            memberId);

        List<ChattingRoomResponseDto> chattingRoomResponseDtoList = chattingRoomService.findChattingRoomByChattingRoomIdList(
            chattingRoomIdList);

        return ResponseEntity.ok(chattingRoomResponseDtoList);
    }


    @Operation(
        summary = "채팅방 생성",
        description = "인증된 사용자가 새로운 채팅방을 생성합니다. 채팅방 이름은 필수이며, 생성자 정보는 인증된 사용자로부터 파생됩니다.",
        security = @SecurityRequirement(name = "bearerAuth"),
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "채팅방 생성 성공",
                content = @Content(schema = @Schema(implementation = ChattingRoomResponseDto.class))
            )
        }
    )
    @PostMapping
    public ResponseEntity<ChattingRoomResponseDto> createRoom(
        @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails customUserDetails,
        @RequestBody ChattingRoomRequestDto chattingRoomRequestDto) {
        ChattingRoomResponseDto chattingRoomResponseDto = chattingRoomService.createNewChattingRoomWithName(
            chattingRoomRequestDto);
        return ResponseEntity.ok(chattingRoomResponseDto);
    }

    @Operation(
        summary = "채팅방 이름 수정",
        description = "인증된 사용자가 특정 채팅방의 이름을 수정합니다.",
        security = @SecurityRequirement(name = "bearerAuth"),
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "채팅방 이름 수정 성공",
                content = @Content(schema = @Schema(implementation = ChattingRoomResponseDto.class))
            )
        }
    )
    @PatchMapping("/{chattingRoomId}")
    public ResponseEntity<ChattingRoomResponseDto> updateRoomName(
        @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails customUserDetails,
        @Parameter(name = "chattingRoomId", description = "수정할 채팅방 ID") @PathVariable("chattingRoomId") Long chattingRoomId,
        @RequestBody ChattingRoomRequestDto chattingRoomRequestDto) {
        ChattingRoomResponseDto chattingRoomResponseDto = chattingRoomService.updateChattingRoomNameById(
            chattingRoomId, chattingRoomRequestDto);
        return ResponseEntity.ok(chattingRoomResponseDto);
    }

    @Operation(
        summary = "채팅방 삭제",
        description = "인증된 사용자가 특정 채팅방을 삭제합니다.",
        security = @SecurityRequirement(name = "bearerAuth"),
        responses = {
            @ApiResponse(
                responseCode = "204",
                description = "채팅방 삭제 성공"
            )
        }
    )
    @DeleteMapping("/{chattingRoomId}")
    public ResponseEntity<Void> deleteRoom(
        @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails customUserDetails,
        @Parameter(name = "chattingRoomId", description = "삭제할 채팅방 ID") @PathVariable("chattingRoomId") Long chattingRoomId) {
        chattingRoomService.deleteChattingRoomById(chattingRoomId);
        return ResponseEntity.noContent().build();
    }
}
