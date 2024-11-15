import { TableRow } from './table.model';

export class AddRow {
  static readonly type = '[Table] Add Row';
  constructor(public row: TableRow) {}
}

export class UpdateRow {
  static readonly type = '[Table] Update Row';
  constructor(public index: number, public row: TableRow) {}
}

export class DeleteRow {
  static readonly type = '[Table] Delete Row';
  constructor(public index: number) {}
}

export class UpdateRowOrder {
  static readonly type = '[Table] Update Row Order';
  constructor(public rows: any[]) {}
}
