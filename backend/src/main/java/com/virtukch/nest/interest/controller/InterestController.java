package com.virtukch.nest.interest.controller;

import com.virtukch.nest.interest.dto.InterestResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/interests")
@RequiredArgsConstructor
@Tag(name = "Interest API", description = "관심 기술 스택 관련 API")
public class InterestController {

    @Operation(summary = "관심 기술 전체 조회", description = "모든 관심 기술 스택 정보를 조회합니다.")
    @GetMapping
    @Deprecated
    public ResponseEntity<List<InterestResponseDto>> findAll() {
        return ResponseEntity.status(HttpStatus.GONE)
                .header("Warning", "299 - \"This API is deprecated and no longer supported\"")
                .build();
    }
}
