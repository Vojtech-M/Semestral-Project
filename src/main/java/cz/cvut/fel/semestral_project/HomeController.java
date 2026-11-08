package cz.cvut.fel.semestral_project;

import cz.cvut.fel.semestral_project.dao.RegistrationRepository;
import cz.cvut.fel.semestral_project.model.Registration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import cz.cvut.fel.semestral_project.dto.RegistrationFormDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class HomeController {

    @Autowired
    private RegistrationRepository registrationRepository;

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("nazev", "ROBOSOUTĚŽ - Přihlašovací formulář (Demo)");
        model.addAttribute("registrationForm", new RegistrationFormDto());
        model.addAttribute("registrations", registrationRepository.findAll());
        return "index";
    }

    @PostMapping("/register")
    public String processForm(@ModelAttribute RegistrationFormDto registrationForm, Model model) {
        Registration reg = new Registration();
        reg.setSchoolName(registrationForm.getSchoolName());
        reg.setSchoolAddress(registrationForm.getSchoolAddress());
        reg.setSchoolCity(registrationForm.getSchoolCity());
        reg.setSchoolZip(registrationForm.getSchoolZip());
        reg.setSchoolWeb(registrationForm.getSchoolWeb());
        reg.setTeamName(registrationForm.getTeamName());
        registrationRepository.save(reg);

        return "redirect:/";
    }
}