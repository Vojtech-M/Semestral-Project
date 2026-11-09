package cz.cvut.fel.semestral_project.service;

import cz.cvut.fel.semestral_project.dao.SchoolRepository;
import cz.cvut.fel.semestral_project.model.School;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SchoolService {

    @Autowired
    private SchoolRepository schoolRepository;

    @Transactional
    public List<School> getAllSchools() {
        return schoolRepository.findAll();
    }

    @Transactional
    public School getSchoolById(Long id) {
        return schoolRepository.find(id);
    }

    @Transactional
    public School createSchool(School school) {
        schoolRepository.persist(school);
        return school;
    }

    @Transactional
    public School updateSchool(Long id, School schoolDetails) {
        School school = schoolRepository.find(id);
        if (school != null) {
            school.setName(schoolDetails.getName());
            school.setCity(schoolDetails.getCity());
            school.setAdress(schoolDetails.getAdress());
            school.setZipCode(schoolDetails.getZipCode());
            school.setWebsite(schoolDetails.getWebsite());
            school.setApproved(schoolDetails.isApproved());
            schoolRepository.update(school);
        }
        return school;
    }

    @Transactional
    public void deleteSchool(Long id) {
        School school = schoolRepository.find(id);
        if (school != null) {
            schoolRepository.remove(school);
        }
    }
}
