package com.filestacker.modules.system.repository;

import com.filestacker.modules.system.entity.SystemSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface SystemRepository extends JpaRepository<SystemSetting, UUID> {

    @Query(value = "SELECT current_database()", nativeQuery = true)
    String getCurrentDatabase();
}
