package cz.cvut.fel.semestral_project.service;

import cz.cvut.fel.semestral_project.model.Registration;
import cz.cvut.fel.semestral_project.model.Team;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ExcelExportService {

    public byte[] exportRegistrationsToExcel(List<Registration> registrations) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Registrace");

            // Header style
            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            // Header row
            Row headerRow = sheet.createRow(0);
            String[] columns = {"ID", "Škola", "Město", "Tým", "Učitel / Kontakt", "Termín", "Stav", "Datum registrace"};
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            // Data rows
            int rowIdx = 1;
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            for (Registration reg : registrations) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(reg.getId() != null ? reg.getId() : 0);
                row.createCell(1).setCellValue(reg.getSchoolName() != null ? reg.getSchoolName() : "");
                row.createCell(2).setCellValue(reg.getSchoolCity() != null ? reg.getSchoolCity() : "");
                row.createCell(3).setCellValue(reg.getTeamName() != null ? reg.getTeamName() : "");

                // Učitel
                String teacherInfo = "";
                if (reg.getTeam() != null && reg.getTeam().getTeacherName() != null) {
                    teacherInfo = reg.getTeam().getTeacherName();
                }
                row.createCell(4).setCellValue(teacherInfo);

                // Termín
                String termInfo = "";
                if (reg.getTournamentTerm() != null) {
                    termInfo = reg.getTournamentTerm().getName() != null ? reg.getTournamentTerm().getName() : "Termín #" + reg.getTournamentTerm().getId();
                }
                row.createCell(5).setCellValue(termInfo);

                // Stav
                row.createCell(6).setCellValue(reg.getStatus() != null ? reg.getStatus().name() : "");

                // Datum
                String dateStr = "";
                if (reg.getRegisteredAt() != null) {
                    dateStr = reg.getRegisteredAt().format(formatter);
                }
                row.createCell(7).setCellValue(dateStr);
            }

            // Auto-size columns
            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }
}
