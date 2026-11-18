package com.filestacker.modules.fileaccess.repository;

import com.filestacker.modules.fileaccess.entity.FileAccess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FileAccessRepository extends JpaRepository<FileAccess, UUID> {
    List<FileAccess> findByFileId(UUID fileId);
    List<FileAccess> findBySharedWith(UUID sharedWith);
}
