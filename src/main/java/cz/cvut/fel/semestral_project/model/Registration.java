package cz.cvut.fel.semestral_project.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "registrations") // Optional, specifies table name
@Data
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

}