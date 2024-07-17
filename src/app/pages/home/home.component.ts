import {Component, inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatButton
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private readonly router: Router = inject(Router);

  public goToPage(page: string): void {
    this.router.navigate([page]);
  }
}
