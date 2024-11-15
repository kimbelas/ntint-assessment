import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { patch, append, updateItem, removeItem } from '@ngxs/store/operators';
import { AddRow, UpdateRow, DeleteRow, UpdateRowOrder } from './table.actions';
import { TableStateModel } from './table.model';

@State<TableStateModel>({
  name: 'table',
  defaults: {
    rows: [
      { rowNumber: 1, firstName: 'John', lastName: 'Doe', dropdown: 'One' },
      { rowNumber: 2, firstName: 'Jane', lastName: 'Smith', dropdown: 'Two' },
      { rowNumber: 3, firstName: 'Tom', lastName: 'Harris', dropdown: 'Three' },
    ],
  },
})
@Injectable()
export class TableState {
  @Selector()
  static rows(state: TableStateModel) {
    return state.rows;
  }

  @Action(AddRow)
  addRow(ctx: StateContext<TableStateModel>, action: AddRow) {
    ctx.setState(patch({ rows: append([action.row]) }));
  }

  @Action(UpdateRow)
  updateRow(ctx: StateContext<TableStateModel>, action: UpdateRow) {
    ctx.setState(
      patch({
        rows: updateItem(action.index, action.row),
      })
    );
  }

  @Action(DeleteRow)
  deleteRow(ctx: StateContext<TableStateModel>, action: DeleteRow) {
    ctx.setState(patch({ rows: removeItem(action.index) }));
  }

  @Action(UpdateRowOrder)
  updateRowOrder(ctx: StateContext<TableStateModel>, action: UpdateRowOrder) {
    ctx.patchState({
      rows: [...action.rows],
    });
  }
}
