package com.umesha_g.the_clique_backend.controller.admin;

import com.umesha_g.the_clique_backend.model.entity.admin.PlatformStatistics;
import com.umesha_g.the_clique_backend.repository.PlatformStatisticsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/platform-statistics")
public class AdminPlatformStatisticsController {

    private PlatformStatisticsRepository platformStatisticsRepository;

    @Autowired
    public AdminPlatformStatisticsController(PlatformStatisticsRepository platformStatisticsRepository) {
        this.platformStatisticsRepository = platformStatisticsRepository;
    }

    @GetMapping
    public ResponseEntity<List<PlatformStatistics>> getPlatformStatistics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<PlatformStatistics> statistics = platformStatisticsRepository.findAll();
        return ResponseEntity.ok(statistics);
    }
}