package com.io.dockerviz.upload;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping(path="/upload")
public class UploadController {
    private final UploadService uploadService;
    @Autowired
    public UploadController(UploadService uploadService) {
        this.uploadService = uploadService;
    }
    @GetMapping
    public String intro(){
        return "<center>Hi! welcome. I'm Mousam.<br>" +
                "Please use a HTTP POST request with your docker-compose file to get started.</center>";
    }
    @PostMapping
    public ResponseEntity<?> handleFileUpload(@RequestParam("file") MultipartFile request,
                                              @RequestParam(defaultValue = "No") String noVolumes) {
        return uploadService.handleFileUpload(request, noVolumes);
    }
}
