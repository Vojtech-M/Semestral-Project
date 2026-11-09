package cz.cvut.fel.semestral_project.rest;

import cz.cvut.fel.semestral_project.dto.RegistrationFormDto;
import cz.cvut.fel.semestral_project.model.Registration;
import cz.cvut.fel.semestral_project.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@CrossOrigin(origins = "http://localhost:5173")
public class RegistrationRestController {

    @Autowired
    private RegistrationService registrationService;

    @GetMapping
    public ResponseEntity<List<Registration>> getAllRegistrations() {
        return ResponseEntity.ok(registrationService.getAllRegistrations());
    }

    @PostMapping
    public ResponseEntity<Void> createRegistration(@RequestBody RegistrationFormDto dto) {
        registrationService.registerTeam(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
