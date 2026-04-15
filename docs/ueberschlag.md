# Überschlagsaufgaben

## Übersicht

Die Seite **"Überschlagsaufgaben"** bietet Arbeitsblätter zum Üben des Überschlags mit vierstelligen Zahlen. Der Überschlag ist eine wichtige mathematische Fähigkeit, bei der Schüler das Ergebnis einer Rechnung durch Runden auf volle Hunderter vorab schätzen.

**URL:** `/ueberschlag?seed=12345`

## Features

- **Seed-basierte Generierung**: Reproduzierbare Arbeitsblätter über URL-Parameter
- **Vierstellige Zahlen**: Alle Aufgaben verwenden Zahlen von 1000-9999
- **Gemischte Operationen**: Addition, Subtraktion und Multiplikation (je 4 Aufgaben)
- **Positivere Ergebnisse**: Bei Subtraktion garantiert positive Ergebnisse (exakt und geschätzt)
- **Zweizeiliges Layout**: "Ü:" für exakte Zahlen, "≈:" für Überschlag mit Platzhaltern
- **Einspaltiger Druck**: Alle Aufgaben untereinander für optimale Lesbarkeit

## Technische Details

### Problem-Typ

```typescript
interface EstimateProblem {
  type: 'estimate';
  operation: 'addition' | 'subtraction' | 'multiplication';
  operand1: number;      // Erste Zahl (1000-9999)
  operand2: number;      // Zweite Zahl (1000-9999 oder 2-9)
  rounded1: number;      // Gerundet auf Hunderter
  rounded2: number;      // Gerundet auf Hunderter
  estimateResult: number; // Überschlag-Ergebnis
  exactResult: number;    // Genaues Ergebnis
}
```

### Konfiguration

```typescript
const estimateConfig = {
  minValue: 1000,         // 4-stellig minimum
  maxValue: 9999,         // 4-stellig maximum
  multiplierMin: 2,       // Für Multiplikation
  multiplierMax: 9,       // Für Multiplikation
  problemsPerPage: 12,    // 4 Addition + 4 Subtraktion + 4 Multiplikation
  problemsPerType: 4,     // Je 4 pro Operation
};
```

### Generator-Algorithmus

**Addition (4 Aufgaben):**
1. Zwei vierstellige Zahlen generieren (1000-9999)
2. Beide auf Hunderter runden
3. Überschlag = gerundete Zahl 1 + gerundete Zahl 2
4. Exaktes Ergebnis = Zahl 1 + Zahl 2

**Subtraktion (4 Aufgaben):**
1. Zwei vierstellige Zahlen generieren (1000-9999)
2. Beide auf Hunderter runden
3. Prüfen: Minuend > Subtrahend (exaktes Ergebnis positiv)
4. Prüfen: gerundeter Minuend > gerundeter Subtrahend (Überschlag positiv)
5. Beide Bedingungen müssen gelten, sonst neue Zahlen

**Multiplikation (4 Aufgaben):**
1. Vierstellige Zahl (1000-9999) und einstellige Zahl (2-9) generieren
2. Vierstellige Zahl auf Hunderter runden
3. Überschlag = gerundete Zahl × einstellige Zahl
4. Exaktes Ergebnis = Zahl × einstellige Zahl

**Mischen:**
- Alle 12 Aufgaben werden zufällig durchmischt

## Grid-Layout

Das spezielle Raster für jede Aufgabe:

```
Zeile 0:  [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] ...
          ↑   ↑
          │   └── Spalte 1: "Ü:" oder "≈:"
          └── Spalte 0: Leer (linker Rand)

Zeile 1:  [ ] [Ü:] [ ] [A] [A] [A] [A] [+] [B] [B] [B] [B] [=] [ ] [ ] [ ]
          ↑   ↑    ↑   ↑   ↑   ↑   ↑   ↑   ↑   ↑   ↑   ↑   ↑
          │   │    │   │   │   │   │   │   └───┴───┴───┴── Zweite Zahl
          │   │    │   └───┴───┴───┴───┴─────────────── Erste Zahl
          │   │    └── Leer (Spacing)
          │   └── "Ü:" Label
          └── Leer (linker Rand)
          
          Unterstrichene Bereiche: Ergebnis-Platzhalter

Zeile 2:  [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ]
          ↑ Leerzeile (Spacing)

Zeile 3:  [ ] [≈:] [ ] [ ] [ ] [ ] [ ] [+] [ ] [ ] [ ] [=] [ ] [ ] [ ] [ ]
          ↑   ↑    ↑   ↑   ↑   ↑   ↑   ↑   ↑   ↑   ↑   ↑
          │   │    │   │   │   │   │   │   └───┴───┴───┴── Gerundete Zahl 2 (Platzhalter)
          │   │    │   └───┴───┴───┴───┴──────────────── Gerundete Zahl 1 (Platzhalter)
          │   │    └── Leer (Spacing)
          │   └── "≈:" Label
          └── Leer (linker Rand)
          
          Alle Zellen unterstrichen: Platzhalter für gerundete Werte

Zeile 4:  [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ]
          ↑ Leerzeile (rechter Rand)
```

**Positionen:**
- **Spalte 0**: Leer (linker Rand)
- **Spalte 1**: "Ü:" oder "≈:" Label
- **Spalte 2**: Leer (Spacing)
- **Spalte 3+**: Die Aufgabe (Zahl, Operator, Zahl, =, Ergebnis)
- **Letzte Spalte**: Leer (rechter Rand)

**Besonderheiten:**
- Beide Zeilen haben unterstrichene Ergebnis-Platzhalter
- Gleiche Größe für beide Ergebnis-Platzhalter (inkl. Vorzeichen-Platz)
- Aufgaben beginnen immer ab Spalte 3
- Rasterbreite wird dynamisch berechnet

## Dateien

### Neue Dateien

- `src/utils/estimate_generator.ts` - Generator für alle drei Operationen
- `src/components/estimate_grid.tsx` - Dynamisches Raster-Komponente
- `src/components/estimate_problem.tsx` - Problem-Komponente
- `src/components/estimate_worksheet.tsx` - Einspaltiges Worksheet
- `src/pages/estimate_page.tsx` - Hauptseite

### Geänderte Dateien

- `src/config/problem_types.ts` - Neuer Typ `EstimateProblem`
- `src/config/math_config.ts` - Neue Config `estimateConfig`
- `src/app.tsx` - Neue Route `/ueberschlag`
- `src/pages/index_page.tsx` - Link zur neuen Seite
- `src/index.css` - CSS-Klasse `.print-worksheet-estimate`

## Benutzung

### Neue Arbeitsblätter generieren

Klicken Sie auf **"Neues Arbeitsblatt"** oder rufen Sie die Seite mit einem zufälligen Seed auf:

```
/ueberschlag?seed=123456
```

### Manuelle Seed-Eingabe

Geben Sie eine Seed-Nummer in das Eingabefeld ein und drücken Sie **"Los"** oder Enter.

### Teilen

Die URL enthält den Seed. Teilen Sie die URL, um das gleiche Arbeitsblatt zu erhalten.

## Beispielaufgabe

**Seed:** 54321

**Aufgabe (Addition):**
- Erste Zahl: 3456
- Zweite Zahl: 2789
- Gerundet: 3500 + 2800
- Überschlag: 6300
- Genaues Ergebnis: 6245

**Grid-Darstellung:**
```
Spalten:   0   1    2   3   4   5   6   7   8   9   10  11  12  13  14
Zeile 1:  [ ] [Ü:] [ ] [3] [4] [5] [6] [+] [2] [7] [8] [9] [=] [_] [_] [_]
                                                  ↑       ↑       ↑
                                                  └── Zahl──┘   Ergebnis
                                                  (unterstrichen)

Zeile 3:  [ ] [≈:] [ ] [ ] [ ] [ ] [ ] [+] [ ] [ ] [ ] [=] [_] [_] [_] [_]
          ↑   ↑    ↑   ↑   ↑   ↑   ↑   ↑   ↑   ↑   ↑   ↑   ↑
          │   │    │   │   │   │   │   │   └───┴───┴───┘   Ergebnis
          │   │    │   └───┴───┴───┴───┴────── Gerundete Zahl 1
          │   │    └── Spacing
          │   └── Label
          └── Rand
          
          Alle Aufgaben-Zellen unterstrichen
```

## Unterschied zu anderen Seiten

| Feature | Division | Multiplikation | Überschlag |
|---------|----------|----------------|------------|
| Zahlenbereich | 3-6 stellig | 3-4 stellig | 4-stellig |
| Operation | Division | Multiplikation | Add/Sub/Mul |
| Aufgaben/Seite | 6-12 | 12 | 12 (gemischt) |
| Grid-Größe | Variabel (10×8 bis 16×14) | Variabel | Dynamisch |
| Drucklayout | 2-3 Spalten | 2-3 Spalten | 1 Spalte |
| Besonderheit | T,H,Z,E Labels | T,H,Z,E Labels | "Ü:" und "≈:" Labels |
| Studenteneingabe | Schriftliche Rechnung | Schriftliche Rechnung | Nur Ergebnis |

## Drucken

Die Seite ist für A4-Druck optimiert:
- Navigation wird ausgeblendet
- Seed und URL werden im Header angezeigt
- **Einspaltiges Layout**: Alle Aufgaben untereinander für optimale Lesbarkeit
- Seitenumbrüche verhindern das Zerschneiden von Aufgaben
- Vergrößerte Zellen für einfaches Ausfüllen

## Hinweise für Lehrer

- **Zweck**: Schüler lernen, Ergebnisse vorab zu schätzen und Plausibilität zu prüfen
- **Vorgehen**: Erst den Überschlag berechnen (Zeile 2), dann genau rechnen (Zeile 4)
- **Kontrolle**: Der Überschlag sollte in der Nähe des genauen Ergebnisses liegen
- **Schwierigkeitsgrad**: Alle Aufgaben haben vierstellige Zahlen für konsistenten Schwierigkeitsgrad
