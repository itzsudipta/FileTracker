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

}
