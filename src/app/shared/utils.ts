import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function stringValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isValid = /^[a-zA-Z\s]*$/.test(control.value);
    return isValid ? null : { invalidString: true };
  };
}
