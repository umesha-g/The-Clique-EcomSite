package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.dto.response.PlatformStatisticsResponse;
import com.umesha_g.the_clique_backend.model.entity.admin.PlatformStatistics;
import com.umesha_g.the_clique_backend.repository.PlatformStatisticsRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlatformStatisticsService {

    private PlatformStatisticsRepository platformStatisticsRepository;
    private ModelMapper modelMapper;

    @Autowired
    public PlatformStatisticsService(PlatformStatisticsRepository platformStatisticsRepository, ModelMapper modelMapper) {
        this.platformStatisticsRepository = platformStatisticsRepository;
        this.modelMapper = modelMapper;
    }

    public void incrementTotalProducts() {
        updatePlatformStatistics(stats -> stats.setTotalProducts(stats.getTotalProducts() + 1));
    }

    public void updateActiveUsers(long activeUsers) {
        updatePlatformStatistics(stats -> stats.setActiveUsers(activeUsers));
    }

    public void addToTotalRevenue(BigDecimal amount) {
        updatePlatformStatistics(stats -> stats.setTotalRevenue(stats.getTotalRevenue().add(amount)));
    }

    public void updatePendingDisputes(long pendingDisputes) {
        updatePlatformStatistics(stats -> stats.setPendingDisputes(pendingDisputes));
    }

    public void incrementNewRegistrations() {
        updatePlatformStatistics(stats -> stats.setNewRegistrations(stats.getNewRegistrations() + 1));
    }

    public void incrementTotalOrders() {
        updatePlatformStatistics(stats -> stats.setTotalOrders(stats.getTotalOrders() + 1));
    }

    public List<PlatformStatisticsResponse> getPlatformStatisticsByDateRange(LocalDate startDate, LocalDate endDate) {
        List<PlatformStatistics> statistics = platformStatisticsRepository.findByDateBetween(startDate, endDate);

        return statistics.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private PlatformStatisticsResponse convertToResponse(PlatformStatistics statistics) {
        return PlatformStatisticsResponse.builder()
                .id(statistics.getId())
                .date(statistics.getDate())
                .totalOrders(statistics.getTotalOrders())
                .totalProducts(statistics.getTotalProducts())
                .activeUsers(statistics.getActiveUsers())
                .totalRevenue(statistics.getTotalRevenue())
                .pendingDisputes(statistics.getPendingDisputes())
                .newRegistrations(statistics.getNewRegistrations())
                .build();
    }

    public PlatformStatisticsResponse aggregatePlatformStatistics(LocalDate startDate, LocalDate endDate) {
        List<PlatformStatistics> statistics = platformStatisticsRepository.findByDateBetween(startDate, endDate);

        return PlatformStatisticsResponse.builder()
                .totalOrders(
                        statistics.stream()
                                .mapToLong(PlatformStatistics::getTotalOrders)
                                .sum()
                )
                .totalRevenue(
                        statistics.stream()
                                .map(PlatformStatistics::getTotalRevenue)
                                .reduce(BigDecimal.ZERO, BigDecimal::add)
                )
                .pendingDisputes(
                        statistics.stream()
                                .mapToLong(PlatformStatistics::getPendingDisputes)
                                .sum()
                )
                .newRegistrations(
                        statistics.stream()
                                .mapToLong(PlatformStatistics::getNewRegistrations)
                                .sum()
                )
                .build();
    }

    private void updatePlatformStatistics(StatisticsUpdater updater) {
        LocalDate today = LocalDate.now();
        PlatformStatistics stats = platformStatisticsRepository.findByDate(today)
                .orElseGet(() -> createNewPlatformStatistics(today));

        updater.update(stats);
        platformStatisticsRepository.save(stats);
    }


    private PlatformStatistics createNewPlatformStatistics(LocalDate date) {
        PlatformStatistics stats = new PlatformStatistics();
        stats.setDate(date);
        stats.setTotalOrders(0);
        stats.setTotalProducts(0);
        stats.setActiveUsers(0);
        stats.setTotalRevenue(BigDecimal.ZERO);
        stats.setPendingDisputes(0);
        stats.setNewRegistrations(0);
        return stats;
    }

    @FunctionalInterface
    private interface StatisticsUpdater {
        void update(PlatformStatistics stats);
    }
}