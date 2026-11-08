package cz.cvut.fel.semestral_project.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "tournament_terms")
@Data
public class TournamentTerm extends BaseEntity {
}

