package com.virtukch.nest.follow.repository;

import com.virtukch.nest.follow.model.Follow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Long> {
    
    // 특정 팔로우 관계 조회
    Optional<Follow> findByFollowerIdAndFollowingId(Long followerId, Long followingId);
    
    // 팔로우 관계 존재 여부 확인
    boolean existsByFollowerIdAndFollowingId(Long followerId, Long followingId);
    
    // 특정 사용자가 팔로잉하는 목록 조회
    List<Follow> findByFollowerIdOrderByCreatedAtDesc(Long followerId);
    
    // 특정 사용자를 팔로우하는 목록 조회 (팔로워 목록)
    List<Follow> findByFollowingIdOrderByCreatedAtDesc(Long followingId);
}
