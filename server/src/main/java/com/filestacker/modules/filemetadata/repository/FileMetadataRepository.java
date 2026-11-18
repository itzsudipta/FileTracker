package com.filestacker.modules.filemetadata.repository;

import com.filestacker.modules.filemetadata.entity.FileMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FileMetadataRepository extends JpaRepository<FileMetadata, UUID> {
    List<FileMetadata> findByFileIdOrderByVerNoDesc(UUID fileId);
}
