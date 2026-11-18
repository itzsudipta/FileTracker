package com.filestacker.modules.file.repository;

import com.filestacker.modules.file.entity.FileInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FileInfoRepository extends JpaRepository<FileInfo, UUID> {

    List<FileInfo> findByOrgIdAndIsDeletedFalse(UUID orgId);

    List<FileInfo> findByOrgIdAndFilenameContainingIgnoreCaseAndIsDeletedFalse(UUID orgId, String filename);

    Optional<FileInfo> findByFileIdAndOrgIdAndIsDeletedFalse(UUID fileId, UUID orgId);

    Optional<FileInfo> findByFileIdAndOrgId(UUID fileId, UUID orgId);

    List<FileInfo> findByIsDeletedFalse();

    long countByIsDeletedFalse();

    @Query("SELECT COALESCE(SUM(f.fileSize), 0) FROM FileInfo f WHERE f.isDeleted = false")
    Long sumStorageUsed();

    @Query("SELECT f, u.userName FROM FileInfo f LEFT JOIN User u ON u.userId = f.ownerId WHERE f.orgId = :orgId AND f.isDeleted = false")
    List<Object[]> findFilesWithOwnerName(@Param("orgId") UUID orgId);

    @Query("SELECT f, u.userName FROM FileInfo f LEFT JOIN User u ON u.userId = f.ownerId WHERE f.orgId = :orgId AND LOWER(f.filename) LIKE LOWER(CONCAT('%', :search, '%')) AND f.isDeleted = false")
    List<Object[]> findFilesWithOwnerNameAndSearch(@Param("orgId") UUID orgId, @Param("search") String search);

    @Query("SELECT f, u.userName FROM FileInfo f LEFT JOIN User u ON u.userId = f.ownerId WHERE f.fileId = :fileId AND f.orgId = :orgId AND f.isDeleted = false")
    List<Object[]> findFileWithOwnerName(@Param("fileId") UUID fileId, @Param("orgId") UUID orgId);
}
