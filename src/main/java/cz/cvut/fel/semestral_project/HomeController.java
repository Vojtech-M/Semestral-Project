package cz.cvut.fel.semestral_project;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;


@Controller
public class HomeController {

    @GetMapping("/")
    public String home(Model model) {
        // Do proměnné 'nazev' si dáme text, který pošleme na web


        model.addAttribute("nazev", "ROBOSOUTĚŽ - Přihlašovací formulář (Demo)");
        // Vrátí název HTML šablony (index.html)
        return "index";
    }

    @PostMapping("/register")
    public String processForm(@ModelAttribute RegistrationFormDto registrationForm, Model model) {
        // Tady si zatím můžeš data vypsat do konzole, abys ověřil, že dorazila
        System.out.println("Přijatá škola: " + registrationForm.getSchoolName());
        System.out.println("Přijatý tým: " + registrationForm.getTeamName());

        // Přesměrování na nějakou potvrzovací stránku nebo zpět
        return "redirect:/";
    }
}