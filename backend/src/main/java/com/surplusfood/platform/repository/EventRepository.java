package com.surplusfood.platform.repository;

import com.surplusfood.platform.model.EventEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<EventEntity, Long> {
}
