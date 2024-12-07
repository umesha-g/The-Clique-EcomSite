package com.umesha_g.the_clique_backend.repository;

import com.umesha_g.the_clique_backend.model.entity.admin.PlatformStatistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PlatformStatisticsRepository extends JpaRepository<PlatformStatistics, String> {
    Optional<PlatformStatistics> findByDate(LocalDate date);

    @Query("SELECT ps FROM PlatformStatistics ps WHERE ps.date BETWEEN :startDate AND :endDate ORDER BY ps.date")
    List<PlatformStatistics> findStatisticsBetweenDates(LocalDate startDate, LocalDate endDate);

    @Query("SELECT ps FROM PlatformStatistics ps ORDER BY ps.date DESC LIMIT 30")
    List<PlatformStatistics> findLatestMonthStatistics();

    List<PlatformStatistics> findByDateBetween(LocalDate startDate, LocalDate endDate);

    PlatformStatistics findFirstByOrderByDateDesc();

    @Query("SELECT SUM(p.totalRevenue) FROM PlatformStatistics p WHERE p.date BETWEEN :startDate AND :endDate")
    BigDecimal sumTotalRevenueByDateRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

}