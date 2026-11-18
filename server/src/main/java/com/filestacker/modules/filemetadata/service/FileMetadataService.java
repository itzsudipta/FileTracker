package com.filestacker.modules.filemetadata.service;

import com.filestacker.modules.filemetadata.entity.FileMetadata;
import com.filestacker.modules.filemetadata.repository.FileMetadataRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class FileMetadataService {

    private final FileMetadataRepository fileMetadataRepository;

    public FileMetadataService(FileMetadataRepository fileMetadataRepository) {
        this.fileMetadataRepository = fileMetadataRepository;
    }

    public List<FileMetadata> getVersionsByFileId(UUID fileId) {
        return fileMetadataRepository.findByFileIdOrderByVerNoDesc(fileId);
    }

    @Transactional
    public FileMetadata save(FileMetadata metadata) {
        if (metadata.getVersionId() == null) {
            metadata.setVersionId(UUID.randomUUID());
        }
        if (metadata.getCreatedAt() == null) {
            metadata.setCreatedAt(LocalDateTime.now());
        }
        return fileMetadataRepository.save(metadata);
    }

    @Transactional
    public FileMetadata createSampleFileMetadata() {
        FileMetadata newMd = new FileMetadata();
        newMd.setVersionId(UUID.randomUUID());
        newMd.setFileId(UUID.fromString("09c99e53-af45-4bdd-a90f-9150d9653fe9"));
        newMd.setVerNo(1);
        newMd.setStoragePath("local/v1/file.txt");
        newMd.setCreatedAt(LocalDateTime.parse("2024-06-15T10:30:00"));
        newMd.setChangelog("File uploaded successfully");
        return fileMetadataRepository.save(newMd);
    }
}
