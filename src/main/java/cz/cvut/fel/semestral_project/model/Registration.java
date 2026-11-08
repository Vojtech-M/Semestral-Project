package cz.cvut.fel.semestral_project.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import cz.cvut.fel.semestral_project.model.enums.RegistrationStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
@Entity
@Table(name = "registrations")
public class Registration extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "team_id", nullable = false)
    @JsonBackReference // Tells Jackson not to serialize back to team from registration
    private Team team;

    private String schoolName;
    private String schoolAddress;
    private String schoolCity;
    private String schoolZip;
    private String schoolWeb;
    private String teamName;
    @Setter
    @ManyToOne
    @JoinColumn(name = "tournament_term_id")
    private TournamentTerm tournamentTerm;
    @Setter
    private RegistrationStatus status;
    @Setter
    private LocalDateTime registeredAt;

}