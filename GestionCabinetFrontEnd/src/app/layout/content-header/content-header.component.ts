import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';



@Component({
  selector: 'app-content-header',
  templateUrl: './content-header.component.html',
  styleUrls: ['./content-header.component.css']
})
export class ContentWrapperComponent implements OnInit  {
  title: string = 'dashboard'; // Default title
  role: any;
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    const storedRole = localStorage.getItem('userRole');
    this.role=storedRole;
    console.log("aaaaaaaaaaaaaaaaaaaaaa",storedRole);
    // Subscribe to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Update the title based on the current route's data
      this.title = this.getTitle(this.activatedRoute);
    });
  }
  private getTitle(route: ActivatedRoute): string {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route.snapshot.data['title'] || 'dashboard'; // Use the default title if not found
  }
}
