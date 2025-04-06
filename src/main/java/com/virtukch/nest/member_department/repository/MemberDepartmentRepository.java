package com.virtukch.nest.member_department.repository;

import com.virtukch.nest.member_department.model.MemberDepartment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberDepartmentRepository extends JpaRepository<MemberDepartment, Long> {

    List<MemberDepartment> findByMemberId(Long memberId);
}
