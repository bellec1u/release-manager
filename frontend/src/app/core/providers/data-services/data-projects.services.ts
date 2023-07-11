import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { IProject } from '../../../shared/models/project.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataProjectsService {

  readonly #httpClient = inject(HttpClient);

  getProjects(): Observable<Array<IProject>> {
    return this.#httpClient.get<Array<IProject>>(`${environment.gitlabUrl}/projects`);
  }

}
