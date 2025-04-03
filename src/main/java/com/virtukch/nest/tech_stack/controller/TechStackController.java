package com.virtukch.nest.tech_stack.controller;

import com.virtukch.nest.tech_stack.dto.TechStackResponseDto;
import com.virtukch.nest.tech_stack.model.TechStack;
import com.virtukch.nest.tech_stack.service.TechStackService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/tech-stacks")
@RequiredArgsConstructor
public class TechStackController {
    private final TechStackService techStackService;

    @GetMapping
    public List<TechStackResponseDto> getTechStacks() {
        return techStackService.findAll();
    }
}
