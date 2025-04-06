package com.virtukch.nest.member_interest.repository;

import com.virtukch.nest.member_interest.model.MemberInterest;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberInterestRepository extends JpaRepository<MemberInterest, Long> {

    List<MemberInterest> findByMemberId(Long memberId);
}
