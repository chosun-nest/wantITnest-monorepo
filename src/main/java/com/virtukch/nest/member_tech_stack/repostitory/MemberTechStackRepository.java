package com.virtukch.nest.member_tech_stack.repostitory;

import com.virtukch.nest.member_tech_stack.model.MemberTechStack;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MemberTechStackRepository extends JpaRepository<MemberTechStack, Long> {

    List<MemberTechStack> findByMemberId(Long memberId);

    @Modifying
    @Query("DELETE FROM MemberTechStack WHERE memberId = :memberId")
    void deleteByMemberId(@Param("memberId") Long memberId);
}
