package com.virtukch.nest.member_department.repository;

import com.virtukch.nest.member_department.model.MemberDepartment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberDepartmentRepository extends JpaRepository<MemberDepartment, Long> {

}
