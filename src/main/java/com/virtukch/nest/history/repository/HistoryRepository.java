package com.virtukch.nest.history.repository;

import com.virtukch.nest.history.model.History;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HistoryRepository extends JpaRepository<History, Long> {

    Optional<History> findByHistoryIdAndMemberId(Long historyId, Long memberId);
}
