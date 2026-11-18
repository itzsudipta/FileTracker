package com.filestacker.modules.file.service;

import com.filestacker.exception.AppException;
import com.filestacker.modules.file.dto.FileResponse;
import com.filestacker.modules.file.dto.SignedUrlResponse;
import com.filestacker.modules.file.entity.FileInfo;
import com.filestacker.modules.file.repository.FileInfoRepository;
import com.filestacker.modules.user.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class FileInfoService {

    private static final long MAX_NORMAL_USER_UPLOAD_BYTES = 1L * 1024 * 1024 * 1024; // 1 GB

    private final FileInfoRepository fileInfoRepository;
    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    @Value("${app.aws.s3-bucket:filestackerstorage}")
    private String s3Bucket;

    public FileInfoService(FileInfoRepository fileInfoRepository, S3Client s3Client, S3Presigner s3Presigner) {
        this.fileInfoRepository = fileInfoRepository;
        this.s3Client = s3Client;
        this.s3Presigner = s3Presigner;
    }

    public List<FileResponse> getFiles(UUID orgId, String search) {
        List<Object[]> rows;
        if (search != null && !search.trim().isEmpty()) {
            rows = fileInfoRepository.findFilesWithOwnerNameAndSearch(orgId, search.trim());
        } else {
            rows = fileInfoRepository.findFilesWithOwnerName(orgId);
        }

        List<FileResponse> result = new ArrayList<>();
        for (Object[] row : rows) {
            FileInfo f = (FileInfo) row[0];
            String ownerName = (String) row[1];
            result.add(new FileResponse(
                    f.getFileId().toString(),
                    f.getFilename(),
                    f.getFileType(),
                    f.getFileSize(),
                    f.getUploadedAt(),
                    f.getStoragePath(),
                    ownerName != null ? ownerName : "Unknown"
            ));
        }
        return result;
    }

    public Optional<FileResponse> getFileById(UUID fileId, UUID orgId) {
        List<Object[]> rows = fileInfoRepository.findFileWithOwnerName(fileId, orgId);
        if (rows.isEmpty()) {
            return Optional.empty();
        }
        Object[] row = rows.get(0);
        FileInfo f = (FileInfo) row[0];
        String ownerName = (String) row[1];
        return Optional.of(new FileResponse(
                f.getFileId().toString(),
                f.getFilename(),
                f.getFileType(),
                f.getFileSize(),
                f.getUploadedAt(),
                f.getStoragePath(),
                ownerName != null ? ownerName : "Unknown"
        ));
    }

    @Transactional
    public FileResponse uploadFile(MultipartFile file, User currentUser) {
        String userName = currentUser.getUserName() != null ? currentUser.getUserName().trim().toLowerCase() : "";
        boolean isUnlimitedUser = userName.startsWith("sudipta");
        long fileSize = file.getSize();

        if (!isUnlimitedUser && fileSize > MAX_NORMAL_USER_UPLOAD_BYTES) {
            throw new AppException(HttpStatus.PAYLOAD_TOO_LARGE, "Normal users can upload files up to 1 GB only.");
        }

        byte[] content;
        try {
            content = file.getBytes();
        } catch (IOException e) {
            throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to read file content: " + e.getMessage());
        }

        String checksum = calculateMd5(content);
        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "unnamed_file";
        String storagePath = currentUser.getOrgId() + "/" + UUID.randomUUID() + "_" + originalFilename;
        String contentType = file.getContentType() != null ? file.getContentType() : "application/octet-stream";

        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(s3Bucket)
                    .key(storagePath)
                    .contentType(contentType)
                    .build();
            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(content));
        } catch (Exception e) {
            throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload to S3: " + e.getMessage());
        }

        FileInfo dbFile = new FileInfo();
        dbFile.setFileId(UUID.randomUUID());
        dbFile.setOwnerId(currentUser.getUserId());
        dbFile.setOrgId(currentUser.getOrgId());
        dbFile.setFilename(originalFilename);
        dbFile.setStoragePath(storagePath);
        dbFile.setFileType(contentType);
        dbFile.setFileSize((long) content.length);
        dbFile.setChecksum(checksum);
        dbFile.setUploadedAt(LocalDateTime.now());
        dbFile.setIsDeleted(false);

        FileInfo saved = fileInfoRepository.save(dbFile);

        return new FileResponse(
                saved.getFileId().toString(),
                saved.getFilename(),
                saved.getFileType(),
                saved.getFileSize(),
                saved.getUploadedAt(),
                saved.getStoragePath(),
                currentUser.getUserName()
        );
    }

    public SignedUrlResponse createSignedUrl(UUID fileId, UUID orgId, String disposition) {
        Optional<FileInfo> fileOpt = fileInfoRepository.findByFileIdAndOrgId(fileId, orgId);
        if (fileOpt.isEmpty()) {
            throw new AppException(HttpStatus.NOT_FOUND, "File not found");
        }
        FileInfo file = fileOpt.get();
        String storagePath = file.getStoragePath() != null ? file.getStoragePath().trim() : "";
        if (storagePath.isEmpty() || "local".equalsIgnoreCase(storagePath)) {
            throw new AppException(HttpStatus.NOT_FOUND, "File is not available in storage");
        }

        try {
            GetObjectRequest.Builder getObjectRequestBuilder = GetObjectRequest.builder()
                    .bucket(s3Bucket)
                    .key(storagePath);

            if (file.getFilename() != null && disposition != null) {
                getObjectRequestBuilder.responseContentDisposition(disposition + "; filename=\"" + file.getFilename() + "\"");
            }

            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofSeconds(60))
                    .getObjectRequest(getObjectRequestBuilder.build())
                    .build();

            PresignedGetObjectRequest presigned = s3Presigner.presignGetObject(presignRequest);
            return new SignedUrlResponse(file.getFilename(), presigned.url().toString());
        } catch (Exception e) {
            throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to generate signed URL: " + e.getMessage());
        }
    }

    @Transactional
    public void deleteFile(UUID fileId, UUID orgId) {
        Optional<FileInfo> fileOpt = fileInfoRepository.findByFileIdAndOrgId(fileId, orgId);
        if (fileOpt.isEmpty()) {
            throw new AppException(HttpStatus.NOT_FOUND, "File not found");
        }
        FileInfo file = fileOpt.get();
        String storagePath = file.getStoragePath() != null ? file.getStoragePath().trim() : "";
        if (!storagePath.isEmpty() && !"local".equalsIgnoreCase(storagePath)) {
            try {
                DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                        .bucket(s3Bucket)
                        .key(storagePath)
                        .build();
                s3Client.deleteObject(deleteRequest);
            } catch (Exception ignored) {
            }
        }
        file.setIsDeleted(true);
        fileInfoRepository.save(file);
    }

    @Transactional
    public Map<String, Object> updateFileTags(UUID fileId, UUID orgId, String filename) {
        Optional<FileInfo> fileOpt = fileInfoRepository.findByFileIdAndOrgId(fileId, orgId);
        if (fileOpt.isEmpty()) {
            throw new AppException(HttpStatus.NOT_FOUND, "File not found");
        }
        FileInfo file = fileOpt.get();
        if (filename != null && !filename.trim().isEmpty()) {
            file.setFilename(filename.trim());
        }
        FileInfo updated = fileInfoRepository.save(file);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "File updated successfully");
        response.put("file", updated);
        return response;
    }

    // Legacy file upload matching FastAPI POST /uploadfile/
    @Transactional
    public FileInfo legacyUploadFile(MultipartFile file) {
        try {
            byte[] content = file.getBytes();
            String checksum = calculateMd5(content);

            FileInfo dbFile = new FileInfo();
            dbFile.setFileId(UUID.randomUUID());
            dbFile.setOwnerId(UUID.fromString("d05215f1-63be-49b9-8188-b6bf59e8b540"));
            dbFile.setOrgId(UUID.fromString("3a833e58-514c-4643-bdff-1a3532e2f830"));
            dbFile.setFilename(file.getOriginalFilename() != null ? file.getOriginalFilename() : "uploaded_file");
            dbFile.setStoragePath("local");
            dbFile.setFileType(file.getContentType() != null ? file.getContentType() : "application/octet-stream");
            dbFile.setFileSize((long) (content.length / 1024)); // In KB as in FastAPI
            dbFile.setChecksum(checksum);
            dbFile.setUploadedAt(LocalDateTime.now());
            dbFile.setIsDeleted(false);

            return fileInfoRepository.save(dbFile);
        } catch (IOException e) {
            throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "File read error: " + e.getMessage());
        }
    }

    public List<FileInfo> getAllFilesLegacy() {
        return fileInfoRepository.findAll();
    }

    private String calculateMd5(byte[] bytes) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(bytes);
            StringBuilder sb = new StringBuilder();
            for (byte b : digest) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            return UUID.randomUUID().toString().replace("-", "");
        }
    }
}
