package cz.cvut.fel.semestral_project.rest;

import cz.cvut.fel.semestral_project.dto.RegistrationFormDto;
import cz.cvut.fel.semestral_project.model.Registration;
import cz.cvut.fel.semestral_project.model.enums.RegistrationStatus;
import cz.cvut.fel.semestral_project.service.ExcelExportService;
import cz.cvut.fel.semestral_project.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/registrations")
@CrossOrigin(origins = "http://localhost:5173")
public class RegistrationRestController {

    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private ExcelExportService excelExportService;

    @GetMapping
    public ResponseEntity<List<Registration>> getAllRegistrations() {
        return ResponseEntity.ok(registrationService.getAllRegistrations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Registration> getRegistrationById(@PathVariable Long id) {
        Registration reg = registrationService.getRegistrationById(id);
        if (reg == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(reg);
    }

    @PostMapping
    public ResponseEntity<Void> createRegistration(@RequestBody RegistrationFormDto dto) {
        registrationService.registerTeam(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Registration> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String statusStr = payload.get("status");
        if (statusStr == null) {
            return ResponseEntity.badRequest().build();
        }
        try {
            RegistrationStatus status = RegistrationStatus.valueOf(statusStr);
            Registration updated = registrationService.updateStatus(id, status);
            if (updated == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRegistration(@PathVariable Long id) {
        registrationService.deleteRegistration(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportExcel() {
        try {
            List<Registration> registrations = registrationService.getAllRegistrations();
            byte[] excelData = excelExportService.exportRegistrationsToExcel(registrations);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDispositionFormData("attachment", "registrations.xlsx");

            return new ResponseEntity<>(excelData, headers, HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
