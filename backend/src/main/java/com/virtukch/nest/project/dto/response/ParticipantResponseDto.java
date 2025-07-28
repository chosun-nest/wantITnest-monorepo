package com.virtukch.nest.project.dto.response;

import com.virtukch.nest.project.model.enums.ParticipantStatus;
import com.virtukch.nest.project.model.enums.Position;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ParticipantResponseDto {
    private Long memberId;
    private String memberName;
    private String memberEmail;
    private String roleName;
    private Position position;     // LEADER or MEMBER
    private ParticipantStatus status;
    private LocalDateTime joinedAt;

}
