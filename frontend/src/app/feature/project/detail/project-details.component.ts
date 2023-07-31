import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { IProject, IProjectDetails } from "../../../shared/models/project.model";
import { NzTreeModule } from "ng-zorro-antd/tree";
import { ProjectsService } from "../../../core/providers/services/projects.services";
import { EMPTY, finalize, Observable, of, switchMap, tap } from "rxjs";
import { AsyncPipe, KeyValuePipe, NgFor, NgIf } from "@angular/common";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzListModule } from "ng-zorro-antd/list";
import { NzSpinModule } from "ng-zorro-antd/spin";

@Component({
  selector: 'release-manager-project-details',
  standalone: true,
  imports: [NzTreeModule, AsyncPipe, NgIf, NgFor, KeyValuePipe, NzCardModule, NzIconModule, NzButtonModule, NzListModule, NzSpinModule],
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.less']
})
export class ProjectDetailsComponent implements OnInit {

  readonly #projectsService = inject(ProjectsService);

  @Input() selectedProject!: IProject;
  @Output() removeSelectedProject = new EventEmitter<number>();

  projectDetails$: Observable<Array<IProjectDetails>> = EMPTY
  isLoading = false;

  ngOnInit(): void {
    this.projectDetails$ = of(this.selectedProject)
      .pipe(
        tap(() => this.isLoading = true),
        switchMap(selectedProject => this.#projectsService.getProjectDetails(selectedProject.id)
          .pipe(
            finalize(() => this.isLoading = false)
          ))
      )
  }

  protected readonly JSON = JSON;
}
