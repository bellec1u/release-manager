import { Component } from '@angular/core';
import { HeaderComponent } from './core/components/header/header.component';
import { ProjectsComponent } from './feature/project/list/projects.component';

@Component({
  selector: 'release-manager-root',
  standalone: true,
  imports: [HeaderComponent, ProjectsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'release-manager';
}
