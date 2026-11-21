package cz.cvut.fel.semestral_project.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "system_settings")
public class SystemSettings extends BaseEntity {
    private String activeMode; // "HIGH" or "PRIMARY"
    private int currentYear;
}
