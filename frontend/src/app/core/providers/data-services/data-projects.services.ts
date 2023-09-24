import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { IProject, IProjectDetails } from '../../../shared/models/project.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataProjectsService {

  readonly #httpClient = inject(HttpClient);

  getProjects(matchingName: string): Observable<Array<IProject>> {
    return this.#httpClient.get<Array<IProject>>(
      `${environment.gitlabUrl}/projects?per_page=100&simple=true&search=${matchingName}`,
      { headers: { Authorization: `Bearer ${environment.gitlabToken}` } });
  }

  getProjectDetails(projectId: number): Observable<Array<IProjectDetails>> {
    return this.#httpClient.get<Array<IProjectDetails>>(
      `${environment.releaseExtractorUrl}?projectId=${projectId}`)
  }

}
