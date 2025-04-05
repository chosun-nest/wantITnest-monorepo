package com.virtukch.nest.department.controller;

import com.virtukch.nest.department.dto.DepartmentResponseDto;
import com.virtukch.nest.department.service.DepartmentService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping
    @Operation(summary = "학과 전체 조회", description = "등록된 모든 학과 정보를 조회합니다.")
    public List<DepartmentResponseDto> getAllDepartments() {
        return departmentService.getAllDepartments();
    }
}
