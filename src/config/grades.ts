export interface WorksheetLink {
  id: string;
  path: string;
  title: string;
  description: string;
  colorClass: string;
}

export interface GradeCategory {
  id: string;
  title: string;
  worksheets: WorksheetLink[];
}

export const gradeCategories: GradeCategory[] = [
  {
    id: 'klasse-4',
    title: 'Klasse 4',
    worksheets: [
      {
        id: 'division',
        path: '/division',
        title: 'Schriftliche Division',
        description: 'Long Division Practice',
        colorClass: 'bg-blue-100 hover:bg-blue-200',
      },
      {
        id: 'division-mit-rest',
        path: '/schriftliche-division-mit-rest',
        title: 'Schriftliche Division mit Rest',
        description: 'Long Division with Remainder',
        colorClass: 'bg-green-100 hover:bg-green-200',
      },
      {
        id: 'multiplication',
        path: '/multiplication',
        title: 'Schriftliche Multiplikation',
        description: 'Multiplikation (3-4 stellig × 1 stellig)',
        colorClass: 'bg-purple-100 hover:bg-purple-200',
      },
      {
        id: 'sammelaufgaben',
        path: '/sammelaufgaben',
        title: 'Sammelaufgaben',
        description: 'Division, Division mit Rest, Multiplikation (je 4 Aufgaben)',
        colorClass: 'bg-orange-100 hover:bg-orange-200',
      },
      {
        id: 'ueberschlag',
        path: '/ueberschlag',
        title: 'Überschlagsaufgaben',
        description: 'Addition, Subtraktion, Multiplikation mit Überschlag (je 4 Aufgaben)',
        colorClass: 'bg-teal-100 hover:bg-teal-200',
      },
    ],
  },
  {
    id: 'klasse-5',
    title: 'Klasse 5',
    worksheets: [
      {
        id: 'addition-subtraktion-1',
        path: '/addition-subtraktion-1',
        title: 'Addition/Subtraktion 1',
        description: '10 Aufgaben: 2- und 3-stellige Zahlen addieren und subtrahieren',
        colorClass: 'bg-sky-100 hover:bg-sky-200',
      },
      {
        id: 'zahlenstrahl-1',
        path: '/zahlenstrahl-1',
        title: 'Zahlenstrahl 1',
        description: '10 Aufgaben: zwei positive natürliche Zahlen auf dem Zahlenstrahl eintragen',
        colorClass: 'bg-lime-100 hover:bg-lime-200',
      },
      {
        id: 'rechenregeln-1',
        path: '/rechenregeln-1',
        title: 'Rechenregeln 1',
        description: '10 Aufgaben: Klammern und Reihenfolge der Rechenoperationen',
        colorClass: 'bg-amber-100 hover:bg-amber-200',
      },
      {
        id: 'sachaufgaben-1',
        path: '/sachaufgaben-1',
        title: 'Sachaufgaben 1',
        description: '5 Sachaufgaben: Strecken, Runden und Nährwerte',
        colorClass: 'bg-rose-100 hover:bg-rose-200',
      },
      {
        id: 'runden-1',
        path: '/runden-1',
        title: 'Runden 1',
        description: 'Runden auf 10er, 100er und 1000er sowie kleinste und größte Ausgangszahl',
        colorClass: 'bg-indigo-100 hover:bg-indigo-200',
      },
    ],
  },
];
