package com.virtukch.nest.project.service;

import com.virtukch.nest.project.dto.converter.ParticipantDtoConverter;
import com.virtukch.nest.project.dto.response.ParticipantResponseDto;
import com.virtukch.nest.project.exception.ProjectException;
import com.virtukch.nest.project.exception.ProjectErrorCode;
import com.virtukch.nest.project.model.Project;
import com.virtukch.nest.project.model.ProjectParticipant;
import com.virtukch.nest.project.repository.ProjectParticipantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectParticipantService {
    
    private final ProjectParticipantRepository participantRepository;
    private final ProjectService projectService;
    
    @Transactional(readOnly = true)
    public List<ParticipantResponseDto> getProjectParticipants(Long projectId) {
        List<ProjectParticipant> participants = participantRepository.findByProjectId(projectId);
        
        return participants.stream()
                .map(ParticipantDtoConverter::toParticipantDto)
                .toList();
    }
    
    @Transactional
    public void removeTeamMember(Long projectId, Long memberId, Long requesterId) {
        // 1. 프로젝트 존재 확인
        Project project = projectService.findByIdOrThrow(projectId);
        
        // 2. 제거할 참여자 존재 확인
        ProjectParticipant participant = participantRepository.findByProjectIdAndMemberId(projectId, memberId)
                .orElseThrow(() -> new ProjectException(ProjectErrorCode.PARTICIPANT_NOT_FOUND));
        
        // 3. 권한 검증: 본인 탈퇴 또는 팀장이 제거하는 경우만 허용
        validateRemovalPermission(project, memberId, requesterId);
        
        // 4. 참여자를 소프트 삭제 (leave 메서드 사용)
        participant.leave();
        participantRepository.save(participant);
        
        log.info("팀원이 제거되었습니다. projectId: {}, memberId: {}, requesterId: {}", projectId, memberId, requesterId);
    }
    
    private void validateRemovalPermission(Project project, Long targetMemberId, Long requesterId) {
        boolean isSelfLeave = targetMemberId.equals(requesterId);
        boolean isProjectCreator = project.getMember().getMemberId().equals(requesterId);
        
        if (!isSelfLeave && !isProjectCreator) {
            throw new ProjectException(ProjectErrorCode.CANNOT_REMOVE_TEAM_MEMBER);
        }
        
        log.debug("권한 검증 통과 - 본인 탈퇴: {}, 팀장 제거: {}", isSelfLeave, isProjectCreator);
    }
}
