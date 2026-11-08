package cz.cvut.fel.semestral_project.controller;

import cz.cvut.fel.semestral_project.dto.RegistrationFormDto;
import cz.cvut.fel.semestral_project.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class HomeController {

    @Autowired
    private RegistrationService registrationService;

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("nazev", "ROBOSOUTĚŽ - Přihlašovací formulář");
        model.addAttribute("registrationForm", new RegistrationFormDto());
        model.addAttribute("registrations", registrationService.getAllRegistrations());
        return "index";
    }

    @PostMapping("/register")
    public String processForm(@ModelAttribute RegistrationFormDto registrationForm, Model model) {
        registrationService.registerTeam(registrationForm);
        return "redirect:/";
    }
}
