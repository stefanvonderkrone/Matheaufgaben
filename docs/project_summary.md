# Math Practice Worksheets - Projekt-Zusammenfassung

## Projekt-Übersicht

Eine Vite + React + TypeScript Single Page Application (SPA) zur Generierung druckbarer Mathe-Arbeitsblätter für schriftliche Division.

## Technologie-Stack

- **Vite** - Build-Tool und Dev-Server
- **React 19** - UI-Bibliothek
- **TypeScript** - Typsicherheit
- **React Router** - Client-seitige Navigation (SPA-Modus, nicht Framework)
- **Tailwind CSS** - Utility-First Styling

## Projektstruktur

```
src/
├── components/
│   ├── division_grid.tsx         # Kernkomponente: Grid-Layout für Aufgaben
│   ├── division_problem.tsx      # Wrapper für einzelne Aufgabe
│   └── division_worksheet.tsx    # Grid aller Aufgaben
├── config/
│   ├── math_config.ts            # Globale Konfiguration
│   └── problem_types.ts          # TypeScript Interfaces
├── pages/
│   ├── index_page.tsx            # Startseite mit Übersicht
│   └── division_page.tsx         # Arbeitsblatt-Seite
├── utils/
│   ├── division_generator.ts     # Aufgaben-Generierung
│   └── random_generator.ts       # Seed-basierte PRNG
├── app.tsx                       # Router-Setup
├── main.tsx                      # Entry Point
└── index.css                     # Globale Styles + Print-CSS
```

## Features

### 1. Division-Arbeitsblätter

**3-stellige Dividenden:**
- Grid-Größe: 10 Spalten × 8 Zeilen
- 3 Aufgaben nebeneinander im Druck

**4-stellige Dividenden:**
- Grid-Größe: 14 Spalten × 11 Zeilen
- 2 Aufgaben nebeneinander im Druck

**Grid-Layout:**
- Zeile 1: Kürzel (T, H, Z, E) über Dividend und Ergebnis
- Zeile 2: Aufgabe in Form "AAA÷B=" (beginnt bei Spalte 2)
- Zeile 3: Minuszeichen (-) im ersten Quadrat, schwarzer unterer Rand für erste zwei Quadrate
- Zeile 4+: Leere Quadrate für handschriftliche Rechnung

### 2. Seed-System

**Reproduzierbare Arbeitsblätter:**
- Jede Aufgabenstellung wird durch einen Seed bestimmt
- URL-Parameter: `/division?seed=12345`
- Gleicher Seed = gleiche Aufgaben

**Seed-Eingabe:**
- Manuelles Eingabefeld im Header
- ENTER oder "Go"-Button aktualisiert URL
- "New Worksheet"-Button generiert zufälligen Seed

**Default Seed:**
- Ohne URL-Parameter wird der Default-Seed `12345` verwendet
- Dies ermöglicht reproduzierbare Ergebnisse beim ersten Aufruf

**Startseite:**
- Link enthält automatisch zufälligen Seed
- Jeder Klick erzeugt neues Arbeitsblatt

### 3. Print-Optimierung

**Druck-Layout:**
- 3-stellig: 3 Aufgaben pro Zeile
- 4-stellig: 2 Aufgaben pro Zeile
- Quadrat-Größe: 6×6mm im Druck
- Schriftgröße: 8pt (Labels), 10pt (Zahlen)

**Print-Header:**
- Titel: "Schriftliche Division"
- Aktueller Seed
- Vollständige URL (inkl. Seed)
- Wiederholt sich auf jeder Seite

**CSS-Klassen:**
- `.no-print` - Wird im Druck ausgeblendet
- `.print-only-header` - Nur im Druck sichtbar
- `.print-worksheet` / `.print-worksheet-4digit` - Druck-Grid-Layout

### 4. Responsive Design

**Mobile:**
- Kleinere Zellen (24×24px)
- 1 Spalte Layout

**Desktop:**
- Normale Zellen (32×32px / 40×40px)
- 2-3 Spalten Layout

**Print:**
- 6×6mm Zellen
- Mehrere Aufgaben nebeneinander

## Git-Commit-Historie

```
43a3990 Align all worksheet problems to the left
ec8a9f0 Use Tailwind print: modifiers with cm/pt units
3f08fd7 Reduce print square size to 10x10mm
2821e26 Reduce print square size to 6x6mm
7811116 Align 3-digit dividend problems to the left
9c881c6 Fix result legend position for 4-digit dividends
c48c69e Change outer border color to gray-300
aa4fba8 Increase square size, thin borders, add minus sign
1d161c5 Add new DivisionGrid component with 10x8 and 14x11 layouts
66949d7 Add core components and pages for division worksheets
bdb43d2 Update README with project documentation
d6530af Initial project setup with Vite, React, TypeScript, Tailwind
```

## Technische Details

### Aufgaben-Generierung

**Algorithmus:**
```typescript
// dividend = divisor × quotient
// 100 ≤ dividend ≤ 9999
// divisor: 2-9 (einstellig)
// quotient: Ganzzahl, ohne Rest
```

**Seeded Random (Mulberry32):**
- Reproduzierbare Zufallszahlen
- Seed aus URL-Parameter oder Default-Seed (12345)

### Grid-System

**Tailwind-Größen:**
- Standard: `w-8 h-8 sm:w-10 sm:h-10`
- Print: `print:w-[6mm] print:h-[6mm]`
- Schrift: `text-lg sm:text-xl print:text-[8pt]`

**Borders:**
- Alle Ränder: `border-gray-300`
- Spezial: Schwarzer unterer Rand für Minuszeichen

### State Management

**DivisionPage:**
- `useSearchParams` für URL-Parameter (Seed aus Query-String)
- `useMemo` für Seed-Berechnung und Problem-Generierung
- `useState` für manuelle Seed-Eingabe
- `useNavigate` für URL-Updates

## Konfiguration

**math_config.ts:**
```typescript
problemsPerPage: 12      // Anzahl Aufgaben pro Arbeitsblatt
dividendMin: 100         // Min. Dividend (3-stellig)
dividendMax: 9999        // Max. Dividend (4-stellig)
divisorMin: 2            // Min. Divisor
divisorMax: 9            // Max. Divisor (einstellig)
```

## Nutzung

### Entwicklung
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
```

### Drucken
1. Browser-Druckfunktion (Strg+P / Cmd+P)
2. A4-Format wird automatisch erkannt
3. Navigation wird ausgeblendet
4. Seed und URL erscheinen im Header

## Zukünftige Erweiterungen

Das Interface `MathProblem` unterstützt:
- Addition (`AdditionProblem`)
- Multiplikation (`MultiplicationProblem`)
- Weitere Operationen

Factory-Pattern für einfache Erweiterung um neue Aufgabentypen.
