package cz.cvut.fel.semestral_project.service;

import cz.cvut.fel.semestral_project.model.Registration;
import cz.cvut.fel.semestral_project.model.Team;
import cz.cvut.fel.semestral_project.model.TeamMember;
import cz.cvut.fel.semestral_project.model.TournamentTerm;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ExcelExportService {

    public byte[] exportRegistrationsToExcel(List<Registration> registrations) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            
            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            String[] columns = {
                "Datum registrace", "Čas registrace", "Jméno školy", "Web školy", "Adresa", "Město", "PSČ",
                "Jméno týmu", "Jméno učitele", "Velikost trička učitele",
                "Člen 1", "Velikost trička 1", "Člen 2", "Velikost trička 2", "Člen 3", "Velikost trička 3",
                "E-mail na učitele", "Telefonní číslo"
            };

            // Group registrations by tournament term ID and name to ensure proper grouping
            Map<String, List<Registration>> groupedByTerm = registrations.stream()
                .collect(Collectors.groupingBy(r -> {
                    if (r.getTournamentTerm() != null) {
                        Long termId = r.getTournamentTerm().getId();
                        String termName = r.getTournamentTerm().getName();
                        return (termId != null ? termId : 0L) + "_" + (termName != null ? termName : "Termín");
                    }
                    return "0_Neznámý termín";
                }));

            if (groupedByTerm.isEmpty()) {
                Sheet sheet = workbook.createSheet("Všechny registrace");
                createSheetContent(sheet, registrations, columns, headerStyle);
            } else {
                int termIndex = 1;
                for (Map.Entry<String, List<Registration>> entry : groupedByTerm.entrySet()) {
                    List<Registration> termRegs = entry.getValue();
                    String sheetName;
                    if (!termRegs.isEmpty() && termRegs.get(0).getTournamentTerm() != null && termRegs.get(0).getTournamentTerm().getName() != null) {
                        sheetName = termRegs.get(0).getTournamentTerm().getName();
                    } else {
                        sheetName = termIndex + ". kolo";
                    }
                    // Excel sheet name max 31 chars and no invalid chars
                    sheetName = sheetName.replaceAll("[\\\\/?*\\[\\]]", "_");
                    if (sheetName.length() > 31) {
                        sheetName = sheetName.substring(0, 31);
                    }

                    Sheet sheet = workbook.createSheet(sheetName);
                    createSheetContent(sheet, termRegs, columns, headerStyle);
                    termIndex++;
                }
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }

    private void createSheetContent(Sheet sheet, List<Registration> registrations, String[] columns, CellStyle headerStyle) {
        Row headerRow = sheet.createRow(0);
        for (int i = 0; i < columns.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(columns[i]);
            cell.setCellStyle(headerStyle);
        }

        int rowIdx = 1;
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");
        for (Registration reg : registrations) {
            Row row = sheet.createRow(rowIdx++);

            String dateStr = "", timeStr = "";
            if (reg.getRegisteredAt() != null) {
                dateStr = reg.getRegisteredAt().format(dateFormatter);
                timeStr = reg.getRegisteredAt().format(timeFormatter);
            }

            row.createCell(0).setCellValue(dateStr);
            row.createCell(1).setCellValue(timeStr);
            row.createCell(2).setCellValue(reg.getSchoolName() != null ? reg.getSchoolName() : "");
            row.createCell(3).setCellValue(reg.getSchoolWeb() != null ? reg.getSchoolWeb() : "");
            row.createCell(4).setCellValue(reg.getSchoolAddress() != null ? reg.getSchoolAddress() : "");
            row.createCell(5).setCellValue(reg.getSchoolCity() != null ? reg.getSchoolCity() : "");
            row.createCell(6).setCellValue(reg.getSchoolZip() != null ? reg.getSchoolZip() : "");
            row.createCell(7).setCellValue(reg.getTeamName() != null ? reg.getTeamName() : "");
            row.createCell(8).setCellValue(reg.getTeacherName() != null ? reg.getTeacherName() : "");
            
            String teacherShirt = "";
            if (reg.getTeam() != null && reg.getTeam().getTShirtSize() != null) {
                teacherShirt = reg.getTeam().getTShirtSize().name();
            }
            row.createCell(9).setCellValue(teacherShirt);

            String m1Name = "", m1Shirt = "", m2Name = "", m2Shirt = "", m3Name = "", m3Shirt = "";
            if (reg.getTeam() != null && reg.getTeam().getTeamMembers() != null) {
                List<TeamMember> members = reg.getTeam().getTeamMembers();
                if (members.size() > 0) {
                    m1Name = members.get(0).getUserName() != null ? members.get(0).getUserName() : "";
                    m1Shirt = members.get(0).getTshirtSize() != null ? members.get(0).getTshirtSize() : "";
                }
                if (members.size() > 1) {
                    m2Name = members.get(1).getUserName() != null ? members.get(1).getUserName() : "";
                    m2Shirt = members.get(1).getTshirtSize() != null ? members.get(1).getTshirtSize() : "";
                }
                if (members.size() > 2) {
                    m3Name = members.get(2).getUserName() != null ? members.get(2).getUserName() : "";
                    m3Shirt = members.get(2).getTshirtSize() != null ? members.get(2).getTshirtSize() : "";
                }
            }

            row.createCell(10).setCellValue(m1Name);
            row.createCell(11).setCellValue(m1Shirt);
            row.createCell(12).setCellValue(m2Name);
            row.createCell(13).setCellValue(m2Shirt);
            row.createCell(14).setCellValue(m3Name);
            row.createCell(15).setCellValue(m3Shirt);

            row.createCell(16).setCellValue(reg.getTeacherEmail() != null ? reg.getTeacherEmail() : "");
            row.createCell(17).setCellValue(reg.getTeacherPhone() != null ? reg.getTeacherPhone() : "");
        }

        for (int i = 0; i < columns.length; i++) {
            sheet.autoSizeColumn(i);
        }
    }
}
