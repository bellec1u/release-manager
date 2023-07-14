import { Component } from '@angular/core';
import { HeaderComponent } from './core/components/header/header.component';
import { ProjectsComponent } from './feature/project/list/projects.component';
import { ProjectDetailsComponent } from "./feature/project/detail/project-details.component";
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { IProject } from "./shared/models/project.model";

@Component({
  selector: 'release-manager-root',
  standalone: true,
  imports: [HeaderComponent, ProjectsComponent, ProjectDetailsComponent, NgForOf, AsyncPipe, NgIf],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  title = 'release-manager';
  selectedProjects: IProject[] = []

  addSelectedProject(project: IProject): void {
    if (this.selectedProjects.filter(selectedProject => selectedProject.id === project.id).length === 0) {
      this.selectedProjects.push(project);
    }
  }

  removeSelectedProject(projectId: number): void {
    this.selectedProjects = this.selectedProjects.filter(selectedProject => selectedProject.id !== projectId);
  }

}
