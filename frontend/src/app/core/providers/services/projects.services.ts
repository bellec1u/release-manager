import { inject, Injectable } from '@angular/core';
import { IProject, IProjectDetails } from '../../../shared/models/project.model';
import { Observable } from 'rxjs';
import { DataProjectsService } from '../data-services/data-projects.services';

@Injectable({ providedIn: 'root' })
export class ProjectsService {

  readonly #dataProjectsService = inject(DataProjectsService);

  getProjects(matchingName: string | null | undefined): Observable<Array<IProject>> {
    return this.#dataProjectsService.getProjects(matchingName ? matchingName : '');
  }

  getProjectDetails(projectId: number): Observable<Array<IProjectDetails>> {
    return this.#dataProjectsService.getProjectDetails(projectId);
  }

}
