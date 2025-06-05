package com.virtukch.nest.tech_stack.controller;

import com.virtukch.nest.tech_stack.dto.TechStackResponseDto;
import com.virtukch.nest.tech_stack.service.TechStackService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/tech-stacks")
@RequiredArgsConstructor
@Tag(name = "Tech Stack API", description = "기술 스택 관련 API")
public class TechStackController {

    private final TechStackService techStackService;

    @Operation(summary = "기술 스택 목록 조회", description = "모든 기술 스택을 조회하여 제공합니다.")
    @GetMapping
    public List<TechStackResponseDto> getTechStacks() {
        return techStackService.findAll();
    }
}
