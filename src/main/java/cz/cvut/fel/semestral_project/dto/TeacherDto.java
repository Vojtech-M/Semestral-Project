package cz.cvut.fel.semestral_project.dto;

import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TeacherDto {
    private Long id;
    private Long schoolId;

    private String name;
    private String email;
    private String phone;
}
