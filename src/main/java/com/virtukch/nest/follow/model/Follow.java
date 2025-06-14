package com.virtukch.nest.follow.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
@Table(
    uniqueConstraints = @UniqueConstraint(
        columnNames = {"follower_id", "following_id"}
    )
)
public class Follow {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "follower_id", nullable = false)
    private Long followerId;
    
    @Column(name = "following_id", nullable = false)
    private Long followingId;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // 정적 팩토리 메서드
    public static Follow createFollow(Long followerId, Long followingId) {
        return Follow.builder()
                .followerId(followerId)
                .followingId(followingId)
                .build();
    }
    
    // 비즈니스 로직 메서드
    public boolean isSelfFollow() {
        return followerId.equals(followingId);
    }
}
