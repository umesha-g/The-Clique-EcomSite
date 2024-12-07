package com.umesha_g.the_clique_backend.controller.admin;

import com.umesha_g.the_clique_backend.dto.response.PlatformStatisticsResponse;
import com.umesha_g.the_clique_backend.service.PlatformStatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/platform-statistics")
@PreAuthorize("hasRole('ADMIN')")
public class AdminPlatformStatisticsController {

    private PlatformStatisticsService platformStatisticsService;

    @Autowired
    public AdminPlatformStatisticsController( PlatformStatisticsService platformStatisticsService) {
        this.platformStatisticsService = platformStatisticsService;
    }

    @GetMapping
    public ResponseEntity<List<PlatformStatisticsResponse>> getPlatformStatistics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<PlatformStatisticsResponse> statistics = platformStatisticsService
                .getPlatformStatisticsByDateRange(startDate, endDate);

        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/aggregate")
    public ResponseEntity<PlatformStatisticsResponse> getAggregatedPlatformStatistics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        PlatformStatisticsResponse aggregatedStatistics = platformStatisticsService
                .aggregatePlatformStatistics(startDate, endDate);

        return ResponseEntity.ok(aggregatedStatistics);
    }

}