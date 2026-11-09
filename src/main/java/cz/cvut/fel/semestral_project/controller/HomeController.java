package cz.cvut.fel.semestral_project.controller;

import cz.cvut.fel.semestral_project.model.Registration;
import cz.cvut.fel.semestral_project.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/home")
public class HomeController {

    @Autowired
    private RegistrationService registrationService;

    @GetMapping
    public List<Registration> getRegistrations() {
        return registrationService.getAllRegistrations();
    }
}
