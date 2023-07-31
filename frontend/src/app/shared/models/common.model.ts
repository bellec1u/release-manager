import { FormControl, FormGroup } from '@angular/forms';

export type SafeAny = any;

export type ControlFromInterface<T extends Record<string, SafeAny>> = {
  [K in keyof T]: T[K] extends Record<string, unknown> ? FormGroup<ControlFromInterface<T[K]>>: FormControl<T[K]>;
}
