package com.virtukch.nest.member_department.service;

import com.virtukch.nest.department.service.DepartmentService;
import com.virtukch.nest.member_department.dto.MemberDepartmentResponseDto;
import com.virtukch.nest.member_department.model.MemberDepartment;
import com.virtukch.nest.member_department.repository.MemberDepartmentRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberDepartmentService {

    private final MemberDepartmentRepository memberDepartmentRepository;
    private final DepartmentService departmentService;

    // 1. MemberDepartment Create
    public void create(Long memberId, List<Long> departmentIdList) {
        List<MemberDepartment> memberDepartmentList = departmentIdList.stream()
            .map(departmentId -> MemberDepartment.builder()
                .memberId(memberId)
                .departmentId(departmentId)
                .build())
            .toList();

        memberDepartmentRepository.saveAll(memberDepartmentList);
    }

    // 2. findByMemberId
    public List<MemberDepartmentResponseDto> findByMemberId(Long memberId) {
        List<MemberDepartment> memberDepartmentList = memberDepartmentRepository.findByMemberId(
            memberId);

        return memberDepartmentList.stream()
            .map(memberDepartment -> MemberDepartmentResponseDto.builder()
                .memberDepartmentId(memberDepartment.getMemberDepartmentId())
                .memberId(memberDepartment.getMemberId())
                .departmentId(memberDepartment.getDepartmentId())
                .departmentName(departmentService.findById(memberDepartment.getDepartmentId()).getDepartmentName())
                .build())
            .toList();
    }
}