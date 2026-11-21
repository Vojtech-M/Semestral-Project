package cz.cvut.fel.semestral_project.rest;

import cz.cvut.fel.semestral_project.dao.TournamentTermDao;
import cz.cvut.fel.semestral_project.model.SystemSettings;
import cz.cvut.fel.semestral_project.model.TournamentTerm;
import cz.cvut.fel.semestral_project.service.SystemSettingsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Admin", description = "Správa nastavení systému, termínů a administrace")
public class AdminController {

    @Autowired
    private SystemSettingsService systemSettingsService;

    @Autowired
    private TournamentTermDao tournamentTermDao;

    @GetMapping("/settings")
    @Operation(summary = "Získat nastavení systému")
    public ResponseEntity<SystemSettings> getSettings() {
        return ResponseEntity.ok(systemSettingsService.getSettings());
    }

    @PutMapping("/settings")
    @Operation(summary = "Aktualizovat nastavení systému (režim, rok)")
    public ResponseEntity<SystemSettings> updateSettings(@RequestBody SystemSettings settings) {
        return ResponseEntity.ok(systemSettingsService.updateSettings(settings));
    }

    @GetMapping("/terms")
    @Operation(summary = "Získat všechny turnajové termíny")
    public ResponseEntity<List<TournamentTerm>> getAllTerms() {
        return ResponseEntity.ok(tournamentTermDao.findAll());
    }

    @PostMapping("/terms")
    @Operation(summary = "Vytvořit nový turnajový termín")
    @Transactional
    public ResponseEntity<TournamentTerm> createTerm(@RequestBody TournamentTerm term) {
        tournamentTermDao.persist(term);
        return ResponseEntity.status(201).body(term);
    }

    @PutMapping("/terms/{id}")
    @Operation(summary = "Upravit turnajový termín")
    @Transactional
    public ResponseEntity<TournamentTerm> updateTerm(@PathVariable Long id, @RequestBody TournamentTerm termDetails) {
        TournamentTerm term = tournamentTermDao.find(id);
        if (term == null) {
            return ResponseEntity.notFound().build();
        }
        term.setName(termDetails.getName());
        tournamentTermDao.update(term);
        return ResponseEntity.ok(term);
    }

    @DeleteMapping("/terms/{id}")
    @Operation(summary = "Smazat turnajový termín")
    @Transactional
    public ResponseEntity<Void> deleteTerm(@PathVariable Long id) {
        TournamentTerm term = tournamentTermDao.find(id);
        if (term != null) {
            tournamentTermDao.remove(term);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
