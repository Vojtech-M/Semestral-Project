package cz.cvut.fel.semestral_project.rest;

import cz.cvut.fel.semestral_project.dao.SchoolDao;
import cz.cvut.fel.semestral_project.model.School;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/schools")
public class SchoolRestController {

    @Autowired
    private SchoolDao schoolDao;

    @GetMapping
    public ResponseEntity<List<School>> getAllSchools() {
        return ResponseEntity.ok(schoolDao.findAll());
    }
}
