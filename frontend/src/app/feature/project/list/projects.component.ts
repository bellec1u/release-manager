import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ProjectsService } from '../../../core/providers/services/projects.services';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { debounceTime, filter, finalize, startWith, switchMap, tap } from 'rxjs';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ProjectsFilterForm } from './projects-filter-form';
import { ReactiveFormsModule } from '@angular/forms';
import { NzEmptyModule } from "ng-zorro-antd/empty";
import { NzListModule } from "ng-zorro-antd/list";
import { IProject } from "../../../shared/models/project.model";
import { NzButtonModule } from "ng-zorro-antd/button";

@Component({
  selector: 'release-manager-projects',
  standalone: true,
  imports: [NgForOf, NgIf, AsyncPipe, NzSpinModule, NzInputModule, NzIconModule, ReactiveFormsModule, NzEmptyModule, NzListModule, NzButtonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.less']
})
export class ProjectsComponent {

  readonly #projectsService = inject(ProjectsService);

  readonly projectsFilterForm = new ProjectsFilterForm();
  readonly projects$ = this.projectsFilterForm.valueChanges
    .pipe(
      debounceTime(250),
      startWith(this.projectsFilterForm.value),
      filter(filter => !!filter.name && 2 < filter.name.length),
      tap(() => this.isLoading = true),
      switchMap(filter => this.#projectsService.getProjects(filter.name)
        .pipe(
          finalize(() => this.isLoading = false)
        ))
    );

  isLoading = false;

  @Output() selectProject = new EventEmitter<IProject>()

}
