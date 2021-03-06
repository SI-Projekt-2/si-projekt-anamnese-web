import { Component, OnInit } from '@angular/core'
import { rootingPath } from '../../shared/rooting-path'
import { Router } from '@angular/router'
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-home-personal',
  templateUrl: './home-personal.component.html',
  styleUrls: ['./home-personal.component.css']
})
export class HomePersonalComponent implements OnInit {
  readonly headerTitle: string = 'Administration - Home'
  readonly personal_info_view_path: string
  readonly currentEnvironment: string

  constructor(
    private router: Router
  ) {
    this.headerTitle = 'Administration - Home'
    this.personal_info_view_path = '/' + rootingPath.personal_info_view
    this.currentEnvironment = environment.currentEnvironment
  }

  ngOnInit(): void {
  }

  navTo(tabName: string): void {
    this.router.navigate([this.personal_info_view_path, {fragment: tabName}])
  }

}
