import { FormControl, FormGroup } from '@angular/forms';
import { ControlFromInterface } from '../../../shared/models/common.model';
import { IProjectFilter } from '../../../shared/models/project.model';

export class ProjectsFilterForm extends FormGroup<ControlFromInterface<IProjectFilter>> {

  constructor() {
    super({
      name: new FormControl(null)
    });
  }

}
