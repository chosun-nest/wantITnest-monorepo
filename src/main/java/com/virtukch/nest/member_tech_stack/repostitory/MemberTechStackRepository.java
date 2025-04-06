package com.virtukch.nest.member_tech_stack.repostitory;

import com.virtukch.nest.member_tech_stack.model.MemberTechStack;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberTechStackRepository extends JpaRepository<MemberTechStack, Long> {

    List<MemberTechStack> findByMemberId(Long memberId);
}
