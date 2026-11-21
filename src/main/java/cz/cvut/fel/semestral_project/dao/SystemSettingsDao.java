package cz.cvut.fel.semestral_project.dao;

import cz.cvut.fel.semestral_project.model.SystemSettings;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class SystemSettingsDao extends BaseDao<SystemSettings> {
    public SystemSettingsDao() {
        super(SystemSettings.class);
    }

    public SystemSettings getSettings() {
        List<SystemSettings> list = findAll();
        if (list.isEmpty()) {
            SystemSettings settings = new SystemSettings();
            settings.setActiveMode("HIGH");
            settings.setCurrentYear(2026);
            persist(settings);
            return settings;
        }
        return list.get(0);
    }
}
