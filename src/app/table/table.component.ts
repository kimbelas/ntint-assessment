import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
  AddRow,
  UpdateRow,
  DeleteRow,
  UpdateRowOrder,
} from '../store/table/table.actions';
import { TableState } from '../store/table/table.state';
import { SharedModule } from '../shared/shared.module';
import { stringValidator } from '../shared/utils';

@Component({
  selector: 'ntint-table',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule, FormsModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @ViewChild(MatSort) sort: any;
  tableForm: FormGroup;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  rows$: Observable<any[]>;
  isEditing: boolean = false;
  deleteTriggered: boolean = false;

  displayedColumns = [
    'rowNumber',
    'firstName',
    'lastName',
    'dropdown',
    'upDown',
    'actions',
  ];
  editingRowIndex: number | null = null;

  constructor(private fb: FormBuilder, private store: Store) {
    this.tableForm = this.fb.group({});
    this.rows$ = this.store.select(TableState.rows);
  }

  ngOnInit() {
    this.rows$.subscribe((rows) => {
      if (rows && rows.length > 0) {
        this.setFormControls(rows);
        this.setDataSource(rows);
      }
    });
  }

  setFormControls(rows: any[]) {
    this.tableForm = this.fb.group({});
    rows.forEach((row, index) => {
      const rowGroup = this.fb.group({
        firstName: [
          { value: row.firstName, disabled: true },
          [Validators.required, stringValidator],
        ],
        lastName: [
          { value: row.lastName, disabled: true },
          [Validators.required, stringValidator],
        ],
        dropdown: [{ value: row.dropdown, disabled: true }],
      });
      this.tableForm.addControl(`row${index}`, rowGroup);
    });
  }

  setDataSource(rows: any[]) {
    this.dataSource = new MatTableDataSource(
      rows.map((row, index) => ({
        ...row,
        rowNumber: index + 1,
      }))
    );
    this.dataSource.sort = this.sort as MatSort;
  }

  getRow(index: number): FormGroup {
    return this.tableForm.get(`row${index}`) as FormGroup;
  }

  sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'firstName':
          return compare(a.firstName, b.firstName, isAsc);
        case 'lastName':
          return compare(a.lastName, b.lastName, isAsc);
        case 'dropdown':
          return compare(a.dropdown, b.dropdown, isAsc);
        default:
          return 0;
      }
    });
  }

  addRow(index: number) {
    const newRow = {
      firstName: '',
      lastName: '',
      dropdown: 'One',
      isNewRow: true,
    };

    const rows = [...this.dataSource.data];
    rows.splice(index + 1, 0, newRow);

    rows.forEach((row, i) => {
      row.rowNumber = i + 1;
    });

    this.setFormControls(rows);
    this.setDataSource(rows);

    const newRowFormGroup = this.getRow(index + 1);
    newRowFormGroup.controls['firstName'].enable();
    newRowFormGroup.controls['lastName'].enable();
    newRowFormGroup.controls['dropdown'].enable();

    this.isEditing = true;
    this.editingRowIndex = index + 1;
  }

  updateRow(index: number) {
    const row = this.getRow(index).value;

    if (this.dataSource.data[index]?.isNewRow) {
      this.store.dispatch(new AddRow(row)).subscribe(() => {
        this.dataSource.data[index].isNewRow = false;
        this.isEditing = false;
        this.editingRowIndex = null;

        this.fetchUpdatedRows();
      });
    } else {
      this.store.dispatch(new UpdateRow(index, row)).subscribe(() => {
        this.isEditing = false;
        this.editingRowIndex = null;

        this.fetchUpdatedRows();
      });
    }
  }

  fetchUpdatedRows() {
    this.rows$.subscribe((rows) => {
      if (rows && rows.length > 0) {
        this.setDataSource(rows);
        this.setFormControls(rows);
      }
    });
  }

  deleteRow(index: number) {
    const rows = this.dataSource.data.filter((_, i) => i !== index);
    this.setFormControls(rows);
    this.setDataSource(rows);
    this.store.dispatch(new DeleteRow(index));

    this.deleteTriggered = true;
  }

  moveRowUp(index: number) {
    if (index > 0) {
      const rows = [...this.dataSource.data];
      [rows[index], rows[index - 1]] = [rows[index - 1], rows[index]];

      rows.forEach((row, i) => {
        row.rowNumber = i + 1;
      });

      this.setFormControls(rows);
      this.setDataSource(rows);

      this.store.dispatch(new UpdateRowOrder(rows));
    }
  }

  moveRowDown(index: number) {
    if (index < this.dataSource.data.length - 1) {
      const rows = [...this.dataSource.data];
      [rows[index], rows[index + 1]] = [rows[index + 1], rows[index]];

      rows.forEach((row, i) => {
        row.rowNumber = i + 1;
      });

      this.setFormControls(rows);
      this.setDataSource(rows);

      this.store.dispatch(new UpdateRowOrder(rows));
    }
  }

  enableEdit(index: number) {
    this.isEditing = true;
    this.editingRowIndex = index;

    this.disableAllRows();

    const rowGroup = this.getRow(index);
    rowGroup.enable();
  }

  sortByColumn(column: string, descending: boolean = false) {
    const direction = descending ? 'desc' : 'asc';
    this.sort.active = column;
    this.sort.direction = direction;
    this.sortData(this.sort);
  }

  saveAfterDelete() {
    Object.keys(this.tableForm.controls).forEach((key) => {
      const rowGroup = this.tableForm.get(key) as FormGroup;
      rowGroup.enable();
    });

    if (this.tableForm.valid) {
      const updatedRows = this.dataSource.data.map((row, index) => ({
        ...row,
        rowNumber: index + 1,
      }));

      this.store.dispatch(new UpdateRowOrder(updatedRows)).subscribe({
        next: () => {
          this.deleteTriggered = false;
          this.setFormControls(updatedRows);
          this.setDataSource(updatedRows);
          alert('Changes saved successfully.');
        },
        error: () => {
          alert('Failed to save changes.');
        },
      });
    } else {
      this.tableForm.markAllAsTouched();
      alert('Form contains invalid data. Please correct errors and try again.');
    }

    this.disableAllRows();
  }

  disableAllRows() {
    Object.keys(this.tableForm.controls).forEach((key) => {
      const rowGroup = this.tableForm.get(key) as FormGroup;
      rowGroup.disable();
    });
    this.editingRowIndex = null;
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
