import { Component, inject } from '@angular/core';
import { ProjectsService } from '../../../core/providers/services/projects.services';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { BehaviorSubject, debounceTime, finalize, startWith, switchMap, tap } from 'rxjs';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ProjectsFilterForm } from './projects-filter-form';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'release-manager-projects',
  standalone: true,
  imports: [NgForOf, NgIf, AsyncPipe, NzSpinModule, NzInputModule, NzIconModule, ReactiveFormsModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.less']
})
export class ProjectsComponent {

  readonly #projectsService = inject(ProjectsService);

  readonly projectsFilterForm = new ProjectsFilterForm();
  readonly isLoading$ = new BehaviorSubject<boolean>(false);
  readonly projects$ = this.projectsFilterForm.valueChanges
    .pipe(
      debounceTime(500),
      startWith(this.projectsFilterForm.value),
      tap(() => this.isLoading$.next(true)),
      switchMap((filter) => this.#projectsService.getProjects()
        .pipe(
          finalize(() => this.isLoading$.next(false))
        ))
    )

}
