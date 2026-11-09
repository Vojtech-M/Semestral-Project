package cz.cvut.fel.semestral_project.rest;

import cz.cvut.fel.semestral_project.dao.TeacherDao;
import cz.cvut.fel.semestral_project.dto.TeacherDto;
import cz.cvut.fel.semestral_project.model.Teacher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/teachers")
@CrossOrigin(origins = "http://localhost:5173")
public class TeacherApiController {

    @Autowired
    private TeacherDao teacherDao;

    @GetMapping
    public ResponseEntity<List<TeacherDto>> getAllTeachers() {
        List<TeacherDto> dtos = teacherDao.findAll().stream().map(t -> {
            TeacherDto dto = new TeacherDto();
            dto.setId(t.getId());
            if (t.getSchool() != null) {
                dto.setSchoolId(t.getSchool().getId());
            }
            return dto;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
