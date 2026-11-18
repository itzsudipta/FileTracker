package com.filestacker.modules.embedding.repository;

import com.filestacker.modules.embedding.entity.EmbeddedData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EmbeddedDataRepository extends JpaRepository<EmbeddedData, UUID> {
    List<EmbeddedData> findByFileId(UUID fileId);
}
