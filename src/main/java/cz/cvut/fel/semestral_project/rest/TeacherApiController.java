package cz.cvut.fel.semestral_project.rest;

import cz.cvut.fel.semestral_project.dto.TeacherDto;
import cz.cvut.fel.semestral_project.model.Teacher;
import cz.cvut.fel.semestral_project.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/teachers")
@CrossOrigin(origins = "http://localhost:5173")
public class TeacherApiController {

    @Autowired
    private TeacherService teacherService;

    private TeacherDto convertToDto(Teacher t) {
        TeacherDto dto = new TeacherDto();
        dto.setId(t.getId());
        dto.setName(t.getName());
        dto.setEmail(t.getEmail());
        dto.setPhone(t.getPhone());
        if (t.getSchool() != null) {
            dto.setSchoolId(t.getSchool().getId());
        }
        return dto;
    }

    @GetMapping
    public ResponseEntity<List<TeacherDto>> getAllTeachers() {
        List<TeacherDto> dtos = teacherService.getAllTeachers().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeacherDto> getTeacherById(@PathVariable Long id) {
        Teacher teacher = teacherService.getTeacherById(id);
        if (teacher == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(convertToDto(teacher));
    }

    @PostMapping
    public ResponseEntity<TeacherDto> createTeacher(@RequestBody Teacher teacher) {
        Teacher created = teacherService.createTeacher(teacher);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeacherDto> updateTeacher(@PathVariable Long id, @RequestBody Teacher teacherDetails) {
        Teacher updated = teacherService.updateTeacher(id, teacherDetails);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(convertToDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeacher(@PathVariable Long id) {
        teacherService.deleteTeacher(id);
        return ResponseEntity.noContent().build();
    }
}
