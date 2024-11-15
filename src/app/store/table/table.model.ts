export interface TableRow {
  rowNumber: number;
  firstName: string;
  lastName: string;
  dropdown: string;
}

export interface TableStateModel {
  rows: TableRow[];
}
