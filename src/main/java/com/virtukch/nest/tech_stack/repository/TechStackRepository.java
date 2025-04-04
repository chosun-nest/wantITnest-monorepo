package com.virtukch.nest.tech_stack.repository;

import com.virtukch.nest.tech_stack.model.TechStack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TechStackRepository extends JpaRepository<TechStack, Long> {

}
