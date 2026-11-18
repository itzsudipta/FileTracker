package com.filestacker.modules.activitylog.repository;

import com.filestacker.modules.activitylog.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, UUID> {
    List<ActivityLog> findByUserIdOrderByLogTimeDesc(UUID userId);
    List<ActivityLog> findByFileIdOrderByLogTimeDesc(UUID fileId);
}
