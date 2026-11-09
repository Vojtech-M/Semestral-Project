package cz.cvut.fel.semestral_project.service;

import cz.cvut.fel.semestral_project.dao.TeacherDao;
import cz.cvut.fel.semestral_project.dao.SchoolRepository;
import cz.cvut.fel.semestral_project.model.Teacher;
import cz.cvut.fel.semestral_project.model.School;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeacherService {

    @Autowired
    private TeacherDao teacherDao;

    @Autowired
    private SchoolRepository schoolRepository;

    @Transactional
    public List<Teacher> getAllTeachers() {
        return teacherDao.findAll();
    }

    @Transactional
    public Teacher getTeacherById(Long id) {
        return teacherDao.find(id);
    }

    @Transactional
    public Teacher createTeacher(Teacher teacher) {
        teacherDao.persist(teacher);
        return teacher;
    }

    @Transactional
    public Teacher updateTeacher(Long id, Teacher teacherDetails) {
        Teacher teacher = teacherDao.find(id);
        if (teacher != null) {
            teacher.setName(teacherDetails.getName());
            teacher.setEmail(teacherDetails.getEmail());
            teacher.setPhone(teacherDetails.getPhone());
            if (teacherDetails.getSchool() != null && teacherDetails.getSchool().getId() != null) {
                School school = schoolRepository.find(teacherDetails.getSchool().getId());
                if (school != null) {
                    teacher.setSchool(school);
                }
            }
            teacherDao.update(teacher);
        }
        return teacher;
    }

    @Transactional
    public void deleteTeacher(Long id) {
        Teacher teacher = teacherDao.find(id);
        if (teacher != null) {
            teacherDao.remove(teacher);
        }
    }
}
