import { Component, OnInit, AfterViewInit, ViewChild ,ViewEncapsulation,OnDestroy } from '@angular/core';

import { MenuNav } from './menu';
import { ApplicationUser } from 'src/app/models/api-model/authentication/ApplicationUser';
import { SharedService } from 'src/app/services/shared/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent   implements OnInit, AfterViewInit,OnDestroy{
  constructor(  private sharedService: SharedService,private router:Router,

    ) {}
  user!: ApplicationUser;
  menu=MenuNav;
  userName='';
  firstName:string | undefined;
  lastName:string | undefined;
  ngOnDestroy(): void {

  }
  ngAfterViewInit(): void {

  }
  ngOnInit(): void {
    this.user = this.sharedService.user;
    this.userName=this.user.username;
    this.firstName=this.user.FirstName;
    this.lastName = this.user.LastName;
    console.log(this.user.username);

  }

  toggleFullscreen() {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
  }

}
logOut(){
  localStorage.removeItem("accessToken");
  this.router.navigateByUrl("login");

}
}
