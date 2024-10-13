package com.umesha_g.the_clique_backend.repository;

import com.umesha_g.the_clique_backend.model.entity.admin.PlatformStatistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface PlatformStatisticsRepository extends JpaRepository<PlatformStatistics, String> {
    Optional<PlatformStatistics> findByDate(LocalDate date);
}