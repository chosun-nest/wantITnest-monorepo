package com.virtukch.nest.member_interest.repository;

import com.virtukch.nest.member_interest.model.MemberInterest;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MemberInterestRepository extends JpaRepository<MemberInterest, Long> {

    List<MemberInterest> findByMemberId(Long memberId);

    @Modifying
    @Query("DELETE FROM MemberInterest WHERE memberId = :memberId")
    void deleteByMemberId(@Param("memberId") Long memberId);
}
