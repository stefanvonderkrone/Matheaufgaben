# Schriftliche Division mit Rest

## Übersicht

Die Seite **"Schriftliche Division mit Rest"** bietet Arbeitsblätter für die schriftliche Division mit Rest. Jede Aufgabe hat garantiert einen Rest (zwischen 1 und Divisor-1).

**URL:** `/schriftliche-division-mit-rest?seed=12345`

## Features

- **Seed-basierte Generierung**: Reproduzierbare Arbeitsblätter über URL-Parameter
- **4- bis 6-stellige Dividenden**: Komplexere Aufgaben als die Standard-Division
- **Garantierter Rest**: Jede Aufgabe hat einen Rest (niemals 0)
- **Spezielles 16×14 Raster**: Angepasstes Layout für schriftliche Division mit Rest
- **2-Spalten Drucklayout**: 6 Aufgaben pro Seite (2×3)

## Technische Details

### Problem-Typ

```typescript
interface DivisionWithRemainderProblem {
  type: 'divisionWithRemainder';
  dividend: number;    // 4-6 stellig (1000-999999)
  divisor: number;     // 1-stellig (2-9)
  quotient: number;    // Ergebnis
  remainder: number;   // Rest (1 bis divisor-1)
}
```

### Konfiguration

```typescript
const divisionWithRemainderConfig = {
  dividendMin: 1000,      // 4-stellig minimum
  dividendMax: 999999,    // 6-stellig maximum
  divisorMin: 2,
  divisorMax: 9,
  problemsPerPage: 6,     // 2 Spalten × 3 Zeilen
};
```

### Generator-Algorithmus

1. Divisor generieren (2-9)
2. Rest generieren (1 bis divisor-1)
3. Quotient berechnen für 4-6 stellige Dividende
4. Dividende = Divisor × Quotient + Rest

## Grid-Layout (16×14)

Das spezielle Raster für jede Aufgabe:

```
Zeile 0:  [Ü] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ]
          ↑ "Ü" in Ecke oben links

Zeile 2:  [ ] [D] [D] [D] [D] [D] [D] [÷] [d] [=] [ ] [ ] [ ] [ ] [ ] [ ]
          ↑   ↑   ↑   ↑   ↑   ↑   ↑   ↑   ↑   ↑
          │   └── Dividende (4-6 Ziffern) │   │   └── Ergebnisbereich
          │                             │   └── Divisor
          │                             └── Teilungszeichen (÷)
          └── Start bei Spalte 1

Zeile 10: [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [P:] [ ] [ ] [ ] [ ] [ ] [ ] [ ]
                                          ↑
                                          └── "P:" unter dem Gleichheitszeichen (=)
```

**Positionen:**
- **"Ü"**: Zeile 0, Spalte 0 (oben links)
- **Aufgabe**: Zeile 2, Spalte 1 (Dividende), gefolgt von ÷, Divisor und =
- **"P:"**: Zeile 10, Spalte des Gleichheitszeichens (8 Zeilen unter der Aufgabe)

## Dateien

### Neue Dateien

- `src/utils/division_mit_rest_generator.ts` - Generator für Aufgaben mit Rest
- `src/components/division_mit_rest_grid.tsx` - 16×14 Raster-Komponente
- `src/components/division_mit_rest_problem.tsx` - Problem-Komponente
- `src/components/division_mit_rest_worksheet.tsx` - 2-Spalten Worksheet
- `src/pages/schriftliche_division_mit_rest_page.tsx` - Hauptseite

### Geänderte Dateien

- `src/config/problem_types.ts` - Neuer Typ `DivisionWithRemainderProblem`
- `src/config/math_config.ts` - Neue Config `divisionWithRemainderConfig`
- `src/app.tsx` - Neue Route `/schriftliche-division-mit-rest`
- `src/pages/index_page.tsx` - Link zur neuen Seite
- `src/index.css` - CSS-Klasse `.print-worksheet-2col`

## Benutzung

### Neue Arbeitsblätter generieren

Klicken Sie auf **"New Worksheet"** oder rufen Sie die Seite mit einem zufälligen Seed auf:

```
/schriftliche-division-mit-rest?seed=123456
```

### Manuelle Seed-Eingabe

Geben Sie eine Seed-Nummer in das Eingabefeld ein und drücken Sie **"Go"** oder Enter.

### Teilen

Die URL enthält den Seed. Teilen Sie die URL, um das gleiche Arbeitsblatt zu erhalten.

## Unterschied zur Standard-Division

| Feature | Standard-Division | Division mit Rest |
|---------|-------------------|-------------------|
| Dividende | 3-4 stellig (100-9999) | 4-6 stellig (1000-999999) |
| Rest | Immer 0 | Immer > 0 (1 bis divisor-1) |
| Grid | 10×8 oder 14×11 | 16×14 |
| Positionen | T, H, Z, E Labels | Keine Labels (nur "Ü") |
| Drucklayout | 3 oder 2 Spalten | 2 Spalten |
| Aufgaben/Seite | 12 | 6 |

## Beispielaufgabe

**Seed:** 12345

**Aufgabe 1:**
- Dividende: 45283
- Divisor: 7
- Quotient: 6469
- Rest: 0 → *Wird neu generiert mit Rest*

Tatsächliche Ausgabe mit Rest:
- Dividende: 45284
- Divisor: 7
- Quotient: 6469
- Rest: 1

**Grid-Darstellung:**
```
Spalten:   0   1   2   3   4   5   6   7   8   9   10  11  12  13  14  15
Zeile 0:  [Ü] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ]
Zeile 2:  [ ] [4] [5] [2] [8] [4] [÷] [7] [=] [ ] [ ] [ ] [ ] [ ] [ ] [ ]
Zeile 10: [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [P:] [ ] [ ] [ ] [ ] [ ] [ ] [ ]
```

## Drucken

Die Seite ist für A4-Druck optimiert:
- Navigation wird ausgeblendet
- Seed und URL werden im Header angezeigt
- 2 Aufgaben nebeneinander
- Seitenumbrüche verhindern das Zerschneiden von Aufgaben
