package com.virtukch.nest.project.repository;

import com.virtukch.nest.project.model.ProjectParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectParticipantRepository extends JpaRepository<ProjectParticipant, Long> {

}