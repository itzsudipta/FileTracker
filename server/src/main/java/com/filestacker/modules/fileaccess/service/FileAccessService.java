package com.filestacker.modules.fileaccess.service;

import com.filestacker.modules.fileaccess.entity.FileAccess;
import com.filestacker.modules.fileaccess.repository.FileAccessRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class FileAccessService {

    private final FileAccessRepository fileAccessRepository;

    public FileAccessService(FileAccessRepository fileAccessRepository) {
        this.fileAccessRepository = fileAccessRepository;
    }

    public List<FileAccess> findByFileId(UUID fileId) {
        return fileAccessRepository.findByFileId(fileId);
    }

    public List<FileAccess> findBySharedWith(UUID sharedWith) {
        return fileAccessRepository.findBySharedWith(sharedWith);
    }

    @Transactional
    public FileAccess save(FileAccess fileAccess) {
        if (fileAccess.getAccesId() == null) {
            fileAccess.setAccesId(UUID.randomUUID());
        }
        return fileAccessRepository.save(fileAccess);
    }

    @Transactional
    public FileAccess createSampleFileAccess() {
        FileAccess newAccess = new FileAccess();
        newAccess.setAccesId(UUID.randomUUID());
        newAccess.setFileId(UUID.fromString("09c99e53-af45-4bdd-a90f-9150d9653fe9"));
        newAccess.setAccessType("private");
        newAccess.setSharedWith(UUID.fromString("d05215f1-63be-49b9-8188-b6bf59e8b540"));
        newAccess.setExpiryDate(LocalDateTime.parse("2024-12-31T23:59:59"));
        newAccess.setMaxDownload(5);
        newAccess.setPwdProtect(true);
        newAccess.setAccessStatus("Active");
        return fileAccessRepository.save(newAccess);
    }
}
