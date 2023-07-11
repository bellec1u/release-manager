import { inject, Injectable } from '@angular/core';
import { IProject } from '../../../shared/models/project.model';
import { Observable } from 'rxjs';
import { DataProjectsService } from '../data-services/data-projects.services';

@Injectable({ providedIn: 'root' })
export class ProjectsService {

  readonly #dataProjectsService = inject(DataProjectsService);

  getProjects(): Observable<Array<IProject>> {
    return this.#dataProjectsService.getProjects();
  }

}
