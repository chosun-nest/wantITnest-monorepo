package com.virtukch.nest.tech_stack.service;

import com.virtukch.nest.tech_stack.dto.TechStackResponseDto;
import com.virtukch.nest.tech_stack.model.TechStack;
import com.virtukch.nest.tech_stack.repository.TechStackRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TechStackService {
    private final TechStackRepository techStackRepository;

    public List<TechStackResponseDto> findAll() {
        return techStackRepository.findAll().stream()
            .map(techStack -> TechStackResponseDto.builder()
                .techStackId(techStack.getTechStackId())
                .techStackName(techStack.getTechStackName())
                .build())
            .collect(Collectors.toList());
    }
}
