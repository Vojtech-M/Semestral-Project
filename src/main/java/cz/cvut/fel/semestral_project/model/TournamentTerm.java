package cz.cvut.fel.semestral_project.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "tournament_terms")
public class TournamentTerm extends BaseEntity {
    private String name;
}


