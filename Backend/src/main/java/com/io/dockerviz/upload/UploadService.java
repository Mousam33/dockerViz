package com.io.dockerviz.upload;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.TimeUnit;

@Service
public class UploadService {
    public ResponseEntity<?> handleFileUpload(MultipartFile file, String noVolumes) {
        String filename = "docker-compose.yml";
        try {
            scriptRunner("./removeDockerCompose");

            file.transferTo( new File("/home/admin/" + filename));

            if (noVolumes.equals("Yes")) {
                scriptRunner("./makeImgNoVolumes");
            } else {
                scriptRunner("./makeImg");
            }

            TimeUnit.SECONDS.sleep(1);

            File image = new File("/home/admin/" + "docker-compose" + ".png");
            Path path = Paths.get(image.getAbsolutePath());
            ByteArrayResource resource = new ByteArrayResource(Files.readAllBytes(path));

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=img.png");
            headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
            headers.add("Pragma", "no-cache");
            headers.add("Expires", "0");

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentLength(image.length())
                    .contentType(MediaType.IMAGE_PNG)
                    .body(resource);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public void scriptRunner(String script) throws Exception {
        ProcessBuilder builder = new ProcessBuilder();
        builder.command("sh", "-c", script);
        Process process = builder.start();
        int exitCode = process.waitFor();
        assert exitCode == 0;
    }
}