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
}