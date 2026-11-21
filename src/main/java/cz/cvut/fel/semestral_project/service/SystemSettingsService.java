package cz.cvut.fel.semestral_project.service;

import cz.cvut.fel.semestral_project.dao.SystemSettingsDao;
import cz.cvut.fel.semestral_project.model.SystemSettings;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SystemSettingsService {

    @Autowired
    private SystemSettingsDao systemSettingsDao;

    @Transactional
    public SystemSettings getSettings() {
        return systemSettingsDao.getSettings();
    }

    @Transactional
    public SystemSettings updateSettings(SystemSettings newSettings) {
        SystemSettings settings = systemSettingsDao.getSettings();
        if (newSettings.getActiveMode() != null) {
            settings.setActiveMode(newSettings.getActiveMode());
        }
        if (newSettings.getCurrentYear() > 0) {
            settings.setCurrentYear(newSettings.getCurrentYear());
        }
        return systemSettingsDao.update(settings);
    }
}
