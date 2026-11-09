package cz.cvut.fel.semestral_project.rest;

import cz.cvut.fel.semestral_project.dto.SchoolDto;
import cz.cvut.fel.semestral_project.model.School;
import cz.cvut.fel.semestral_project.service.SchoolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schools")
@CrossOrigin(origins = "http://localhost:5173")
public class SchoolApiController {

    @Autowired
    private SchoolService schoolService;

    @GetMapping
    public ResponseEntity<List<SchoolDto>> getAllSchools() {
        List<SchoolDto> dtos = schoolService.getAllSchools().stream()
                .map(SchoolDto::new)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SchoolDto> getSchoolById(@PathVariable Long id) {
        School school = schoolService.getSchoolById(id);
        if (school == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new SchoolDto(school));
    }

    @PostMapping
    public ResponseEntity<SchoolDto> createSchool(@RequestBody School school) {
        School created = schoolService.createSchool(school);
        return ResponseEntity.status(HttpStatus.CREATED).body(new SchoolDto(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SchoolDto> updateSchool(@PathVariable Long id, @RequestBody School schoolDetails) {
        School updated = schoolService.updateSchool(id, schoolDetails);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new SchoolDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchool(@PathVariable Long id) {
        schoolService.deleteSchool(id);
        return ResponseEntity.noContent().build();
    }
}
