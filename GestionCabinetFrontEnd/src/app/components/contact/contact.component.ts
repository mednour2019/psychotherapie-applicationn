import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationUser } from 'src/app/models/api-model/authentication/ApplicationUser';
import { UserResponse } from 'src/app/models/api-model/authentication/UserResponse.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { SharedService } from 'src/app/services/shared/shared.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, AfterViewInit {
  user!: ApplicationUser;
  allUsers:UserResponse[] = [];

  constructor(private router: Router,
    private sharedService: SharedService,
    private authenticationService: AuthenticationService,) {


  }
  ngOnInit(): void {
    this.getUsers();
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      this.sharedService.updateMenuBasedOnRole(storedRole);
    }
  }
  ngAfterViewInit(): void {

  }
  getUsers() {
    this.user = this.sharedService.user;
    this.authenticationService.GetUsers(this.user.id).subscribe({
      next: (successResponse) => {
        console.log(successResponse);
        this.allUsers=successResponse;
      },
      error: (errorResponse) => {
        console.log(errorResponse);
      },
    });
  }


}
