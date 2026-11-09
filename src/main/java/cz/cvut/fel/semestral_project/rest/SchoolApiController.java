package cz.cvut.fel.semestral_project.rest;

import cz.cvut.fel.semestral_project.dao.SchoolDao;
import cz.cvut.fel.semestral_project.dao.SchoolRepository;
import cz.cvut.fel.semestral_project.dto.SchoolDto;
import cz.cvut.fel.semestral_project.model.School;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schools")
@CrossOrigin(origins = "http://localhost:5173")
public class SchoolApiController {

    @Autowired
    private SchoolRepository schoolRepository; // případně SchoolService

    @GetMapping
    public List<SchoolDto> getAllSchools() {
        return schoolRepository.findAll()
                .stream()
                .map(SchoolDto::new)
                .toList();
    }
}