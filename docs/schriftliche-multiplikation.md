# Schriftliche Multiplikation

## Übersicht

Die Seite **"Schriftliche Multiplikation"** bietet Arbeitsblätter für die schriftliche Multiplikation. Jede Aufgabe besteht aus einem 3- oder 4-stelligen Faktor, der mit einem 1-stelligen Faktor multipliziert wird.

**URL:** `/multiplication?seed=12345`

## Features

- **Seed-basierte Generierung**: Reproduzierbare Arbeitsblätter über URL-Parameter
- **3- bis 4-stellige erste Faktoren**: Flexibler Schwierigkeitsgrad
- **1-stelliger zweiter Faktor**: Immer 2-9 (keine 0 oder 1)
- **Spezielles 9×6 Raster**: Kompaktes Layout für schriftliche Multiplikation
- **Quersumme als Hilfe**: Automatisch berechnete Quersumme des Ergebnisses
- **2-Spalten Drucklayout**: 12 Aufgaben pro Seite (2×6)

## Technische Details

### Problem-Typ

```typescript
interface MultiplicationProblem {
  type: 'multiplication';
  factor1: number;       // 3-4 stellig (100-9999)
  factor2: number;       // 1-stellig (2-9)
  product: number;       // Ergebnis
}
```

### Konfiguration

```typescript
const multiplicationConfig = {
  factor1Min: 100,         // 3-stellig minimum
  factor1Max: 9999,      // 4-stellig maximum
  factor2Min: 2,
  factor2Max: 9,
  problemsPerPage: 12,   // 2 Spalten × 6 Zeilen
};
```

### Generator-Algorithmus

1. Ersten Faktor generieren (100-9999)
2. Zweiten Faktor generieren (2-9)
3. Produkt berechnen: factor1 × factor2

## Grid-Layout (9×6)

Das spezielle Raster für jede Aufgabe:

```
Zeile 0:  [ ] [T] [H] [Z] [E] [ ] [ ] [ ] [ ]
              ↑___↑___↑___↑
              │   │   │   └── Einer
              │   │   └── Zehner
              │   └── Hunderter
              └── Tausender
              (Nur über dem ersten Faktor!)

Zeile 1:  [ ] [a] [b] [c] [d] [·] [e] [ ] [ ]
              ↑_______________↑
              │   │   │   │   │   │   │
              └───┴───┴───┴───┴───┴───┘
              Fetter Unterstrich (border-b-2 border-b-black)
              Über erstem Faktor, Operator und zweitem Faktor
              
          a,b,c,d = Ziffern des ersten Faktors
          ·       = Multiplikationszeichen
          e       = Zweiter Faktor (1-stellig)

Zeile 2:  [ ] [ ] [ ] [ ] [ ] [ ] [Q] [ ] [ ]
                                  ↑
                                  └── Quersumme des Ergebnisses
                                      (kleine Schrift)

Zeile 3-5: [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ]
           Leere Zellen für handschriftliche Rechnung
```

**Positionen:**
- **Legende**: Zeile 0, nur über dem ersten Faktor (Spalten 1-4 je nach Ziffernanzahl)
- **Aufgabe**: Zeile 1, erster Faktor + Operator + zweiter Faktor
- **Unterstrich**: Fette Linie unter dem ersten Faktor, Operator und zweitem Faktor
- **Quersumme**: Zeile 2, Spalte 6 (hinter dem zweiten Faktor)
- **Ergebnis**: Zeile 1, Spalten 7-8 (leere Zellen für Schüler)

## Dateien

### Neue Dateien

- `src/utils/multiplication_generator.ts` - Generator für Multiplikationsaufgaben
- `src/components/multiplication_grid.tsx` - 9×6 Raster-Komponente
- `src/components/multiplication_problem.tsx` - Problem-Komponente
- `src/components/multiplication_worksheet.tsx` - 2-Spalten Worksheet
- `src/pages/multiplication_page.tsx` - Hauptseite

### Geänderte Dateien

- `src/config/math_config.ts` - Neue Config `multiplicationConfig`
- `src/app.tsx` - Neue Route `/multiplication`
- `src/pages/index_page.tsx` - Link zur neuen Seite

## Benutzung

### Neue Arbeitsblätter generieren

Klicken Sie auf **"New Worksheet"** oder rufen Sie die Seite mit einem zufälligen Seed auf:

```
/multiplication?seed=123456
```

### Manuelle Seed-Eingabe

Geben Sie eine Seed-Nummer in das Eingabefeld ein und drücken Sie **"Go"** oder Enter.

### Teilen

Die URL enthält den Seed. Teilen Sie die URL, um das gleiche Arbeitsblatt zu erhalten.

## Unterschied zur Division

| Feature | Schriftliche Division | Schriftliche Multiplikation |
|---------|----------------------|---------------------------|
| Operation | ÷ (Division) | × (Multiplikation) |
| Erster Operand | 3-4 stellig | 3-4 stellig |
| Zweiter Operand | 1-stellig | 1-stellig |
| Ergebnis | Quotient | Produkt |
| Grid-Größe | 10×8 oder 14×11 | 9×6 |
| Legende | T, H, Z, E über beidem | Nur über erstem Faktor |
| Unterstrich | Nur erste Zeile | Unter erstem Faktor + Operator + 2. Faktor |
| Zusatzinfo | Minuszeichen | Quersumme des Ergebnisses |
| Drucklayout | 3 oder 2 Spalten | 2 Spalten |
| Aufgaben/Seite | 12 | 12 |

## Beispielaufgabe

**Seed:** 12345

**Aufgabe 1:**
- Erster Faktor: 3476
- Zweiter Faktor: 8
- Produkt: 27808
- Quersumme: 2+7+8+0+8 = 25

**Grid-Darstellung:**
```
Spalten:   0   1   2   3   4   5   6   7   8
Zeile 0:  [ ] [T] [H] [Z] [E] [ ] [ ] [ ] [ ]
Zeile 1:  [ ] [3] [4] [7] [6] [·] [8] [ ] [ ]
              ───────────────────────
              (fette Linie unter Zeile 1)
Zeile 2:  [ ] [ ] [ ] [ ] [ ] [ ] [25] [ ] [ ]
```

## Drucken

Die Seite ist für A4-Druck optimiert:
- Navigation wird ausgeblendet
- Seed und URL werden im Header angezeigt
- 2 Aufgaben nebeneinander
- Seitenumbrüche verhindern das Zerschneiden von Aufgaben
- Quersumme in kleinerer Schrift als Hilfestellung

## Quersumme

Die Quersumme wird automatisch berechnet und als Kontrollmöglichkeit angezeigt:

```typescript
export function calculateChecksum(number: number): number {
  return number
    .toString()
    .split('')
    .reduce((sum, digit) => sum + parseInt(digit, 10), 0);
}
```

**Beispiele:**
- 12345 → 1+2+3+4+5 = 15
- 999 → 9+9+9 = 27
- 27808 → 2+7+8+0+8 = 25
