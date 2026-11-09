package cz.cvut.fel.semestral_project.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeamDto {
    private Long id;
    private String name;
    private String teacherName;
    private String tShirtSize;
    private Long schoolId;
    private Long teacherId;
}
