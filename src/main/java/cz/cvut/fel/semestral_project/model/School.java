package cz.cvut.fel.semestral_project.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "schools")
@Data
public class School {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String city;
    private boolean approved = false;
}