import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { Menu } from 'src/app/layout/side-bar/menu';
import { ApplicationUser } from 'src/app/models/api-model/authentication/ApplicationUser';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { DataSharingService } from 'src/app/services/dataService.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { MenuNav } from 'src/app/layout/nav-bar/menu';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  user: ApplicationUser = {
    id: '',
    username: '',
    password: '',
    FirstName: '',
    LastName: '',
    AccessToken: '',
    role: '',
  };
  menuSideBar = Menu; // Import the menu
  menuNavbar=MenuNav;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private sharedService: SharedService
  ) {}
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService
      .login(this.f['username'].value, this.f['password'].value)
      .pipe(first())
      .subscribe({
        next: (res) => {
          localStorage.setItem('accessToken', res.accessToken);
          localStorage.setItem('refreshToken', res.refreshToken);
          localStorage.setItem('userRole', res.role); // Store the user role
          this.user = {
            id: res.idUser,
            username: res.userName,
            FirstName: res.firstName,
            LastName: res.lastName,
            role: res.role,
          };
          this.sharedService.setUser(this.user);
          this.updateMenuBasedOnRole(this.user.role);
          console.log('ressssssss ', res);
          console.log('user is in sign ', this.user);
          if (this.user.role == 'Patient') {
            this.router.navigate(['dashboard/prd-rdv']);
          } else {
            this.router.navigate(['dashboard/stat']);
          }
          // this.router.navigate(['dashboard/stat']);
        },
        error: (error) => {
          // this.error = error;
          this.error = 'Authentication error!';
          this.loading = false;
        },
      });
  }
  updateMenuBasedOnRole(role: string) {
    //about side bar
    this.menuSideBar.forEach((menuItem, index) => {
      if (index!= this.menuSideBar.length-1)
      {
          menuItem.show = role == 'Patient' ? false : true;
          menuItem.subMenu.forEach((subMenuItem) => {
            subMenuItem.show = role == 'Patient' ? false : true;
          });
      }
    });
    this.menuSideBar[2].show=role=='Patient'?true:false;
    this.menuSideBar[2].subMenu[0].show=role=='Patient'?true:false;

    // about navbar

    this.menuNavbar.forEach((menuItem, index) => {
      menuItem.show = role == 'Patient' ? false : true;
    });

  }
}
