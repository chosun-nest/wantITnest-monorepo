package com.virtukch.nest.interest.service;

import com.virtukch.nest.interest.dto.InterestResponseDto;
import com.virtukch.nest.interest.exception.InterestNotFoundException;
import com.virtukch.nest.interest.repository.InterestRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InterestService {

    private final InterestRepository interestRepository;

    public List<InterestResponseDto> findAll() {
        return interestRepository.findAll().stream()
            .map(interest -> InterestResponseDto.builder()
                .interestId(interest.getInterestId())
                .interestName(interest.getInterestName())
                .build())
            .toList();
    }

    public InterestResponseDto findById(long interestId) {
        return interestRepository.findById(interestId)
            .map(interest -> InterestResponseDto.builder()
                .interestId(interest.getInterestId())
                .interestName(interest.getInterestName())
                .build())
            .orElseThrow(() -> new InterestNotFoundException("Interest Not Found"));
    }
}
