package com.filestacker.modules.file.controller;

import com.filestacker.modules.auth.service.AuthService;
import com.filestacker.modules.file.dto.FileResponse;
import com.filestacker.modules.file.dto.SignedUrlResponse;
import com.filestacker.modules.file.entity.FileInfo;
import com.filestacker.modules.file.service.FileInfoService;
import com.filestacker.modules.user.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.hibernate.boot.model.naming.IllegalIdentifierException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@CrossOrigin
public class FileController {

    private final FileInfoService fileInfoService;
    private final AuthService authService;

    public FileController(FileInfoService fileInfoService, AuthService authService) {
        this.fileInfoService = fileInfoService;
        this.authService = authService;
    }

    // 1. GET /api/files - Fetch all uploaded files
    @GetMapping("/api/files")
    public ResponseEntity<List<FileResponse>> getAllFiles(
            @RequestParam(value = "search", required = false) String search,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        User currentUser = authService.resolveCurrentUser(request, response);
        List<FileResponse> files = fileInfoService.getFiles(currentUser.getOrgId(), search);
        return ResponseEntity.ok(files);
    }

    // 2. GET /api/files/{file_id} - Get single file metadata
    @GetMapping("/api/files/{file_id}")
    public ResponseEntity<?> getFileById(
            @PathVariable("file_id") UUID fileId,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        User currentUser = authService.resolveCurrentUser(request, response);
        Optional<FileResponse> file = fileInfoService.getFileById(fileId, currentUser.getOrgId());
        if (file.isEmpty()) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "File not found");
            return ResponseEntity.ok(err);
        }
        return ResponseEntity.ok(file.get());
    }

    // 3. POST /api/files/upload - Upload new file
    @PostMapping("/api/files/upload")
    public ResponseEntity<FileResponse> uploadFile(
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        User currentUser = authService.resolveCurrentUser(request, response);
//        if (file.getName().length() < 30) throw new IllegalIdentifierException("File name too large");
        FileResponse saved = fileInfoService.uploadFile(file, currentUser);
        return ResponseEntity.ok(saved);
    }

    // 4. GET /api/files/{file_id}/open - Open a file in browser
    @GetMapping("/api/files/{file_id}/open")
    public ResponseEntity<SignedUrlResponse> openFile(
            @PathVariable("file_id") UUID fileId,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        User currentUser = authService.resolveCurrentUser(request, response);
        SignedUrlResponse signedUrl = fileInfoService.createSignedUrl(fileId, currentUser.getOrgId(), "inline");
        return ResponseEntity.ok(signedUrl);
    }

    // 5. GET /api/files/{file_id}/download - Download a file
    @GetMapping("/api/files/{file_id}/download")
    public ResponseEntity<SignedUrlResponse> downloadFile(
            @PathVariable("file_id") UUID fileId,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        User currentUser = authService.resolveCurrentUser(request, response);
        SignedUrlResponse signedUrl = fileInfoService.createSignedUrl(fileId, currentUser.getOrgId(), "attachment");
        return ResponseEntity.ok(signedUrl);
    }

    // 6. DELETE /api/files/{file_id} - Delete a file
    @DeleteMapping("/api/files/{file_id}")
    public ResponseEntity<Map<String, String>> deleteFile(
            @PathVariable("file_id") UUID fileId,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        User currentUser = authService.resolveCurrentUser(request, response);
        fileInfoService.deleteFile(fileId, currentUser.getOrgId());
        Map<String, String> res = new HashMap<>();
        res.put("message", "File deleted successfully");
        return ResponseEntity.ok(res);
    }

    // 7. PATCH /api/files/{file_id}/tags - Update file tags/metadata
    @PatchMapping("/api/files/{file_id}/tags")
    public ResponseEntity<?> updateFileTags(
            @PathVariable("file_id") UUID fileId,
            @RequestParam(value = "filename", required = false) String filename,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        User currentUser = authService.resolveCurrentUser(request, response);
        Map<String, Object> res = fileInfoService.updateFileTags(fileId, currentUser.getOrgId(), filename);
        return ResponseEntity.ok(res);
    }

    // Legacy: POST /uploadfile/
    @PostMapping("/uploadfile/")
    public ResponseEntity<FileInfo> legacyUploadFile(@RequestParam("file") MultipartFile file) {
        FileInfo info = fileInfoService.legacyUploadFile(file);
        return ResponseEntity.ok(info);
    }

    // Legacy: GET /getfilesdata/
    @GetMapping("/getfilesdata/")
    public ResponseEntity<?> legacyGetFilesData() {
        List<FileInfo> files = fileInfoService.getAllFilesLegacy();
        if (files.isEmpty()) {
            return ResponseEntity.ok("No files found");
        }
        return ResponseEntity.ok(files);
    }
}
