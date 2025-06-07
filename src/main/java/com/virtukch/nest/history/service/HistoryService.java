package com.virtukch.nest.history.service;

import com.virtukch.nest.history.dto.HistoryRequestDto;
import com.virtukch.nest.history.dto.HistoryResponseDto;
import com.virtukch.nest.history.dto.HistoryUpdateRequestDto;
import com.virtukch.nest.history.exception.DuplicateHistoryCreationException;
import com.virtukch.nest.history.exception.DuplicateHistoryIdException;
import com.virtukch.nest.history.exception.EmptyHistoryCreationException;
import com.virtukch.nest.history.exception.EmptyHistoryDeleteException;
import com.virtukch.nest.history.exception.EmptyHistoryUpdateException;
import com.virtukch.nest.history.exception.HistoryAccessDeniedException;
import com.virtukch.nest.history.exception.HistoryNotFoundException;
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
            .orElseThrow(() -> new HistoryNotFoundException("해당 히스토리를 찾을 수 없습니다."));
        return toDto(history);
    }

    public List<HistoryResponseDto> getHistoriesByMember(Long memberId) {
        return historyRepository.findAllByMemberId(memberId).stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public HistoryResponseDto updateHistory(Long memberId, Long historyId, HistoryRequestDto dto) {
        History history = historyRepository.findByHistoryIdAndMemberId(historyId, memberId)
            .orElseThrow(() -> new HistoryNotFoundException("수정 권한이 없거나 히스토리가 존재하지 않습니다."));

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
            .orElseThrow(() -> new HistoryNotFoundException("삭제 권한이 없거나 히스토리가 존재하지 않습니다."));
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

    public List<HistoryResponseDto> createHistories(Long memberId, List<HistoryRequestDto> dtoList) {
        if (dtoList == null || dtoList.isEmpty()) {
            throw new EmptyHistoryCreationException("히스토리 생성 요청이 비어 있습니다.");
        }

        // 중복 요청 검사 (startDate + content 기준)
        long distinctCount = dtoList.stream()
            .map(dto -> dto.getStartDate().toString() + "::" + dto.getContent())
            .distinct()
            .count();

        if (distinctCount != dtoList.size()) {
            throw new DuplicateHistoryCreationException("중복된 히스토리 생성 요청이 포함되어 있습니다.");
        }

        List<History> histories = dtoList.stream()
            .map(dto -> History.builder()
                .memberId(memberId)
                .content(dto.getContent())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .important(dto.isImportant())
                .build())
            .collect(Collectors.toList());

        return historyRepository.saveAll(histories).stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public List<HistoryResponseDto> updateHistories(Long memberId, List<HistoryUpdateRequestDto> dtoList) {
        if (dtoList == null || dtoList.isEmpty()) {
            throw new EmptyHistoryUpdateException("히스토리 수정 요청이 비어 있습니다.");
        }

        long uniqueCount = dtoList.stream()
            .map(HistoryUpdateRequestDto::getHistoryId)
            .distinct()
            .count();

        if (uniqueCount != dtoList.size()) {
            throw new DuplicateHistoryIdException("업데이트 요청에 중복된 히스토리 ID가 포함되어 있습니다.");
        }

        List<History> updated = dtoList.stream()
            .map(dto -> {
                History original = historyRepository.findByHistoryIdAndMemberId(dto.getHistoryId(), memberId)
                    .orElseThrow(() -> new HistoryNotFoundException("히스토리를 찾을 수 없습니다."));
                return History.builder()
                    .historyId(original.getHistoryId())
                    .memberId(memberId)
                    .content(dto.getContent())
                    .startDate(dto.getStartDate())
                    .endDate(dto.getEndDate())
                    .important(dto.isImportant())
                    .build();
            })
            .collect(Collectors.toList());

        return historyRepository.saveAll(updated).stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public void deleteHistories(Long memberId, List<Long> historyIds) {
        if (historyIds == null || historyIds.isEmpty()) {
            throw new EmptyHistoryDeleteException("히스토리 삭제 요청이 비어 있습니다.");
        }

        List<History> toDelete = historyRepository.findAllById(historyIds).stream()
            .filter(h -> h.getMemberId().equals(memberId))
            .collect(Collectors.toList());

        if (toDelete.size() != historyIds.size()) {
            throw new HistoryAccessDeniedException("요청에 삭제 권한이 없는 히스토리가 포함되어 있습니다.");
        }

        historyRepository.deleteAll(toDelete);
    }
}