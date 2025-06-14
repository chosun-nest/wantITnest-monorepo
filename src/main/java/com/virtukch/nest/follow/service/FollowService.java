package com.virtukch.nest.follow.service;

import com.virtukch.nest.follow.dto.FollowListResponseDto;
import com.virtukch.nest.follow.dto.FollowResponseDto;
import com.virtukch.nest.follow.dto.FollowUserDto;
import com.virtukch.nest.follow.exception.AlreadyFollowingException;
import com.virtukch.nest.follow.exception.FollowRelationshipNotFoundException;
import com.virtukch.nest.follow.exception.SelfFollowException;
import com.virtukch.nest.follow.model.Follow;
import com.virtukch.nest.follow.repository.FollowRepository;
import com.virtukch.nest.member.exception.MemberNotFoundException;
import com.virtukch.nest.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FollowService {

    private final FollowRepository followRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public FollowResponseDto followUser(Long followerId, Long followingId) {
        log.info("팔로우 요청 - followerId: {}, followingId: {}", followerId, followingId);
        
        // 1. 자기 자신을 팔로우하는지 검증
        if (followerId.equals(followingId)) {
            throw new SelfFollowException();
        }
        
        // 2. 팔로우할 사용자가 존재하는지 확인
        if (!memberRepository.existsById(followingId)) {
            throw new MemberNotFoundException("팔로우할 회원을 찾을 수 없습니다. ID: " + followingId);
        }
        
        // 3. 이미 팔로우 중인지 확인
        if (followRepository.existsByFollowerIdAndFollowingId(followerId, followingId)) {
            throw new AlreadyFollowingException();
        }
        
        // 4. 팔로우 관계 생성
        Follow follow = Follow.createFollow(followerId, followingId);
        Follow savedFollow = followRepository.save(follow);
        
        log.info("팔로우 완료 - Follow ID: {}", savedFollow.getId());
        
        // 5. 응답 DTO 생성
        return FollowResponseDto.from(savedFollow);
    }

    @Transactional
    public void unfollowUser(Long followerId, Long followingId) {
        log.info("언팔로우 요청 - followerId: {}, followingId: {}", followerId, followingId);
        
        // 1. 자기 자신을 언팔로우하는지 검증
        if (followerId.equals(followingId)) {
            throw new SelfFollowException("자기 자신을 언팔로우할 수 없습니다.");
        }
        
        // 2. 팔로우 관계가 존재하는지 확인
        Follow follow = followRepository.findByFollowerIdAndFollowingId(followerId, followingId)
                .orElseThrow(FollowRelationshipNotFoundException::new);
        
        // 3. 팔로우 관계 삭제
        followRepository.delete(follow);
        
        log.info("언팔로우 완료 - Follow ID: {}", follow.getId());
    }

    @Transactional(readOnly = true)
    public FollowListResponseDto getFollowingList(Long memberId) {
        log.info("팔로잉 목록 조회 요청 - memberId: {}", memberId);
        
        // 1. 회원 존재 여부 확인
        if (!memberRepository.existsById(memberId)) {
            throw new MemberNotFoundException("회원을 찾을 수 없습니다. ID: " + memberId);
        }
        
        // 2. 팔로잉 관계 목록 조회
        List<Follow> followList = followRepository.findByFollowerIdOrderByCreatedAtDesc(memberId);
        
        // 3. 팔로잉하는 사용자들의 ID 목록 추출
        List<Long> followingIds = followList.stream()
                .map(Follow::getFollowingId)
                .toList();
        
        // 4. 팔로잉하는 사용자들의 정보 조회
        List<FollowUserDto> followUserDtoList = followingIds.isEmpty() ? 
                List.of() : 
                memberRepository.findAllById(followingIds).stream()
                        .map(member -> {
                            // 해당 회원의 팔로우 시작 시간 찾기
                            LocalDateTime followedAt = followList.stream()
                                    .filter(follow -> follow.getFollowingId().equals(member.getMemberId()))
                                    .findFirst()
                                    .map(Follow::getCreatedAt)
                                    .orElse(null);
                            
                            return FollowUserDto.from(member, followedAt);
                        })
                        .toList();
        
        log.info("팔로잉 목록 조회 완료 - memberId: {}, 팔로잉 수: {}", memberId, followUserDtoList.size());
        
        // 5. 응답 DTO 생성
        return FollowListResponseDto.forFollowing(followUserDtoList);
    }

    @Transactional(readOnly = true)
    public FollowListResponseDto getFollowersList(Long memberId) {
        log.info("팔로워 목록 조회 요청 - memberId: {}", memberId);
        
        // 1. 회원 존재 여부 확인
        if (!memberRepository.existsById(memberId)) {
            throw new MemberNotFoundException("회원을 찾을 수 없습니다. ID: " + memberId);
        }
        
        // 2. 팔로워 관계 목록 조회 (나를 팔로우하는 사용자들)
        List<Follow> followerList = followRepository.findByFollowingIdOrderByCreatedAtDesc(memberId);
        
        // 3. 나를 팔로우하는 사용자들의 ID 목록 추출
        List<Long> followerIds = followerList.stream()
                .map(Follow::getFollowerId)
                .toList();
        
        // 4. 팔로워 사용자들의 정보 조회
        List<FollowUserDto> followerUserDtoList = followerIds.isEmpty() ? 
                List.of() : 
                memberRepository.findAllById(followerIds).stream()
                        .map(member -> {
                            // 해당 회원이 나를 팔로우한 시작 시간 찾기
                            LocalDateTime followedAt = followerList.stream()
                                    .filter(follow -> follow.getFollowerId().equals(member.getMemberId()))
                                    .findFirst()
                                    .map(Follow::getCreatedAt)
                                    .orElse(null);
                            
                            return FollowUserDto.from(member, followedAt);
                        })
                        .toList();
        
        log.info("팔로워 목록 조회 완료 - memberId: {}, 팔로워 수: {}", memberId, followerUserDtoList.size());
        
        // 5. 응답 DTO 생성
        return FollowListResponseDto.forFollowers(followerUserDtoList);
    }
}
