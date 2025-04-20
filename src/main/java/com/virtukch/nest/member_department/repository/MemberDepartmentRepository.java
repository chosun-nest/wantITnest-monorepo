package com.virtukch.nest.member_department.repository;

import com.virtukch.nest.member_department.model.MemberDepartment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MemberDepartmentRepository extends JpaRepository<MemberDepartment, Long> {

    List<MemberDepartment> findByMemberId(Long memberId);

    @Modifying
    @Query("DELETE FROM MemberDepartment WHERE memberId = :memberId")
    void deleteByMemberId(@Param("memberId") Long memberId);
}
