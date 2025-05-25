package com.virtukch.nest.interest.controller;

import com.virtukch.nest.interest.dto.InterestResponseDto;
import com.virtukch.nest.interest.service.InterestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/interests")
@RequiredArgsConstructor
@Tag(name = "Interest API", description = "관심 기술 스택 관련 API")
public class InterestController {

    private final InterestService interestService;

//    @Operation(summary = "관심 기술 전체 조회", description = "모든 관심 기술 스택 정보를 조회합니다.")
//    @GetMapping
//    public List<InterestResponseDto> findAll() {
//        return interestService.findAll();
//    }
}
