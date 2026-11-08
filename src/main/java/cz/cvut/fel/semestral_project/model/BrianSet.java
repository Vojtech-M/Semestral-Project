package cz.cvut.fel.semestral_project.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "brian_sets")
@Data
public class BrianSet extends BaseEntity {
}

