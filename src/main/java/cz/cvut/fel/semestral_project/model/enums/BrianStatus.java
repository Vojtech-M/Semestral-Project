package cz.cvut.fel.semestral_project.model.enums;

/**
 * Enum representing the status of a Brian.
 */
public enum BrianStatus {
    AVAILABLE,
    BORROWED,
    NOT_READY,
    AWAITING_PICKUP;

    public static final BrianStatus DEFAULT = BrianStatus.AVAILABLE;
}
