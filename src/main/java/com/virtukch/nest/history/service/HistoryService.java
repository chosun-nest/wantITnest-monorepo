package com.virtukch.nest.history.service;

import com.virtukch.nest.history.dto.HistoryRequestDto;
import com.virtukch.nest.history.dto.HistoryResponseDto;
import com.virtukch.nest.history.model.History;
import com.virtukch.nest.history.repository.HistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HistoryService {

    private final HistoryRepository historyRepository;

    public HistoryResponseDto createHistory(Long memberId, HistoryRequestDto dto) {
        History saved = historyRepository.save(History.builder()
            .memberId(memberId)
            .content(dto.getContent())
            .startDate(dto.getStartDate())
            .endDate(dto.getEndDate())
            .important(dto.isImportant())
            .build());
        return toDto(saved);
    }

    public HistoryResponseDto getHistoryById(Long memberId, Long historyId) {
        History history = historyRepository.findByHistoryIdAndMemberId(historyId, memberId)
            .orElseThrow(() -> new RuntimeException("해당 히스토리를 찾을 수 없습니다."));
        return toDto(history);
    }

    public List<HistoryResponseDto> getHistoriesByMember(Long memberId) {
        return historyRepository.findAll().stream()
            .filter(h -> h.getMemberId().equals(memberId))
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public HistoryResponseDto updateHistory(Long memberId, Long historyId, HistoryRequestDto dto) {
        History history = historyRepository.findByHistoryIdAndMemberId(historyId, memberId)
            .orElseThrow(() -> new RuntimeException("수정 권한이 없거나 히스토리가 존재하지 않습니다."));

        History updated = historyRepository.save(History.builder()
            .historyId(history.getHistoryId())
            .memberId(memberId)
            .content(dto.getContent())
            .startDate(dto.getStartDate())
            .endDate(dto.getEndDate())
            .important(dto.isImportant())
            .build());

        return toDto(updated);
    }

    public void deleteHistory(Long memberId, Long historyId) {
        History history = historyRepository.findByHistoryIdAndMemberId(historyId, memberId)
            .orElseThrow(() -> new RuntimeException("삭제 권한이 없거나 히스토리가 존재하지 않습니다."));
        historyRepository.delete(history);
    }

    private HistoryResponseDto toDto(History history) {
        return HistoryResponseDto.builder()
            .historyId(history.getHistoryId())
            .memberId(history.getMemberId()) // 개발 단계에서만 사용
            .content(history.getContent())
            .startDate(history.getStartDate())
            .endDate(history.getEndDate())
            .important(history.isImportant())
            .build();
    }
}