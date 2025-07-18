package com.virtukch.nest.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class ViewCountService {

    private final RedisTemplate<String, String> redisTemplate;
    private static final long VIEW_COUNT_LOCK_TIME = 1;

    public boolean checkAndSetView(String domain, Long domainId, Long memberId) {
        String key = "view:" + domain + ":" + domainId + ":" + memberId;
        if (redisTemplate.opsForValue().get(key) == null) {
            redisTemplate.opsForValue().set(key, "1", VIEW_COUNT_LOCK_TIME, TimeUnit.HOURS);
            return true;
        }
        return false;
    }
}
