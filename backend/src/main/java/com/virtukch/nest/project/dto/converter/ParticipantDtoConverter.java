package com.virtukch.nest.project.dto.converter;

import com.virtukch.nest.project.dto.response.ParticipantResponseDto;
import com.virtukch.nest.project.model.ProjectParticipant;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ParticipantDtoConverter {
    public static ParticipantResponseDto toParticipantDto(ProjectParticipant participant) {
        return ParticipantResponseDto.builder()
                .memberId(participant.getMember().getMemberId())
                .memberName(participant.getMember().getMemberName())
                .memberEmail(participant.getMember().getMemberEmail())
                .roleName(participant.getRole().getRoleName())
                .position(participant.getPosition())
                .status(participant.getStatus())
                .joinedAt(participant.getJoinedAt())
                .build();
    }
}
