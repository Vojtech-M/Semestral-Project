# 🤖 Přihlašovací formulář pro registraci týmů do ROBOSOUTĚŽE
**Autor:** Vojtěch Michal  
**Vedoucí práce:** Ing. Martin Hlinovský, Ph.D. (Katedra řídicí techniky, FEL ČVUT)

### Popis projektu
Cílem projektu je návrh a realizace nového informačního a přihlašovacího systému pro registraci týmů do **ROBOSOUTĚŽE** organizované pro žáky středních a základních škol. Systém slouží k automatizaci a zjednodušení celého procesu – od správy databáze škol a týmů přes výběr soutěžních termínů až po evidenci zapůjčených stavebnic a kostek Brian. Součástí systému je také administrátorská sekce pro schvalování nově přidaných škol, správy registrací a generování podkladů pro organizátory (exporty do Excelu či tisk adresních etiket).

### Hlavní funkce
- **Registrace týmů a škol:** Výběr školy z databáze nebo přidání nové školy (s následným schválením administrátorem).
- **Správa soutěžních termínů:** Přihlašování týmů na konkrétní kola a termíny soutěže dle kategorie (ZŠ / SŠ).
- **Evidence a výpůjčky stavebnic Brian:** Správa zapůjčených LEGO stavebnic a kostek Brian určených pro přípravu týmů.
- **Administrátorský panel:** Kompletní správa databáze, schvalování škol, správa výpůjček a úprava přihlášek.
- **Export dat a podkladů:** Generování seznamů účastníků (.xlsx / .csv) a automatická příprava adresních etiket pro rozesílání stavebnic.
- **Veřejný výpis týmů:** Automatické zobrazování aktuálně přihlášených týmů na stránkách Robosoutěže.

### Role v systému
- **Učitel / Vedoucí týmu** – výběr školy, registrace týmů, výběr termínu a žádost o zapůjčení stavebnice.
- **Návštěvník webu** – prohlížení seznamu přihlášených týmů na veřejné části webu.
- **Administrátor (Organizátor)** – schvalování škol, správa termínů, výpůjček a generování exportů/etiket.

### Cílová skupina
Systém je určen pro organizátory Robosoutěže z FEL ČVUT a pro mentory (učitele) ze středních a základních škol, kteří přihlašují své žáky do soutěže.

---

## 🚀 Instalace a spuštění (Docker)
Projekt je připraven pro snadné spuštění v kontejnerech. Není potřeba lokálně instalovat Javu ani PostgreSQL databázi, stačí mít nainstalovaný **Docker Desktop**.

### Krok 1: Sestavení aplikace
Nejprve je potřeba vytvořit spustitelný `.jar` soubor. Otevřete terminál v kořenové složce projektu:

- **Windows:**
  ```bash
  .\gradlew.bat bootJar
  ```
- **Mac/Linux:**
  ```bash
  ./gradlew bootJar
  ```

### Krok 2: Spuštění přes Docker
Spusťte aplikaci i s databází pomocí Docker Compose:

```bash
docker-compose up --build
```

Aplikace bude následně dostupná v prohlížeči na adrese: `http://localhost:8080`

### Ukončení aplikace
Pro zastavení stiskněte `Ctrl + C` v terminálu nebo zadejte:

```bash
docker-compose down
```

---

## 🛠️ Použité technologie
<div>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg" title="Java 21" alt="Java_logo" width="50" height="50"/>&nbsp;
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/spring/spring-original.svg" title="Spring Boot" alt="Spring_logo" width="50" height="50"/>&nbsp;
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/gradle/gradle-original.svg" title="Gradle" alt="Gradle_logo" width="50" height="50"/>&nbsp;
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg" title="PostgreSQL" alt="PostgreSQL_logo" width="50" height="50"/>&nbsp;
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg" title="Docker" alt="Docker_logo" width="50" height="50"/>&nbsp;
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/intellij/intellij-original.svg" title="IntelliJ IDEA" alt="IDEA_logo" width="50" height="50"/>
</div>

---

## 📌 Repozitář a informace
Tento repozitář obsahuje práci k předmětu **Semestrální projekt** (B6B36PRO) a navazující **Bakalářské práci** na ČVUT FEL (2026).

- **Oficiální web Robosoutěže:** [https://robosoutez.fel.cvut.cz/](https://robosoutez.fel.cvut.cz/)