package com.virtukch.nest.department.service;

import com.virtukch.nest.department.dto.DepartmentResponseDto;
import com.virtukch.nest.department.model.Department;
import com.virtukch.nest.department.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public List<DepartmentResponseDto> getAllDepartments() {
        List<Department> departments = departmentRepository.findAll();

        return departments.stream()
            .map(department -> DepartmentResponseDto.builder()
                .departmentId(department.getDepartmentId())
                .departmentName(department.getDepartmentName())
                .build())
            .toList();
    }
}
