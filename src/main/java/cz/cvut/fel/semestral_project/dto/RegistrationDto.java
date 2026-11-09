package cz.cvut.fel.semestral_project.dto;

import cz.cvut.fel.semestral_project.model.enums.RegistrationStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

public record RegistrationDto(
        Long id,

        @NotNull(message = "Team ID is required")
        @Positive(message = "Team ID must be a positive number")
        Long teamId,

        @NotBlank(message = "School name is required")
        String schoolName,

        @NotBlank(message = "School address is required")
        String schoolAddress,

        @NotBlank(message = "School city is required")
        String schoolCity,

        @NotBlank(message = "School ZIP is required")
        String schoolZip,

        String schoolWeb,

        @NotBlank(message = "Team name is required")
        String teamName,

        @NotNull(message = "Tournament term ID is required")
        @Positive(message = "Tournament term ID must be a positive number")
        Long tournamentTermId,

        @NotNull(message = "Status is required")
        RegistrationStatus status,

        LocalDateTime registeredAt
) {}