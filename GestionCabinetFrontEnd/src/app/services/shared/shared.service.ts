import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MenuNav } from 'src/app/layout/nav-bar/menu';
import { Menu } from 'src/app/layout/side-bar/menu';
import { ApplicationUser } from 'src/app/models/api-model/authentication/ApplicationUser';
import { factureResponse } from 'src/app/models/api-model/fact/factResponse.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
   // private clickSubject = new Subject<void>();
   facture!: factureResponse;

   private dateChangeSubject = new Subject<{ startDate: Date, endDate: Date,btnId: string }>();
   dateChangeEvent$ = this.dateChangeSubject.asObservable();
   emitDateChangeEvent(startDate: Date, endDate: Date,btnId: string) {
    this.dateChangeSubject.next({ startDate, endDate,btnId });
  }
    // Observable to subscribe to click events
    /*clickEvent$ = this.clickSubject.asObservable();
    // Method to emit click events
    emitClickEvent() {
        this.clickSubject.next();
    }*/

    private storageKey = 'cubeOlapChoosen';
    private storageKeyReport = 'reportOlapCube';
    private storageKeyUser = 'User';
    user!:ApplicationUser;
    // related about disable button
    private disableButton = false;
    private readonly storageKeyBtn = 'disableButton';
    //////////////////////////////////
    menuSideBar = Menu; // Import the menu
    menuNavbar=MenuNav;

  constructor() {
    var  storedData = localStorage.getItem(this.storageKey);
    var  storedDataReport = localStorage.getItem(this.storageKeyReport);
    var  storedDataUser = localStorage.getItem(this.storageKeyUser);
    


    if (storedData) {
    //  this.olapCubeChoosen = JSON.parse(storedData);
    }
    if (storedDataReport) {
     //   this.reportOlap = JSON.parse(storedDataReport);
      }
    if (storedDataUser) {
        this.user = JSON.parse(storedDataUser);
      }
   }
   setDisableButton(value: boolean) {
   // this.disableButton = value;
   localStorage.setItem(this.storageKeyBtn, JSON.stringify(value));

  }
  getDisableButton() {
    const storedValue = localStorage.getItem(this.storageKeyBtn);
    return storedValue ? JSON.parse(storedValue) : false;
    //return this.disableButton;
  }
  
   setFactrToView(factr: factureResponse) {
    this.facture = factr;
    localStorage.setItem(this.storageKey, JSON.stringify(factr));
  }
 /* setReportOlap(reportOlap:AddReportRequest) {
    this.reportOlap = reportOlap;
    localStorage.setItem(this.storageKeyReport, JSON.stringify(reportOlap));
  }*/
  setUser(user:ApplicationUser) {
    this.user = user;
    localStorage.setItem(this.storageKeyUser, JSON.stringify(user));
  }
  /*clearCubeOlapChoosen() {
    this.olapCubeChoosen=null;
    localStorage.removeItem(this.storageKey);
  }*/
 /* updateMenuBasedOnRole(role:string){
    this.menuSideBar.forEach(menuItem => {
      menuItem.show=role=="Patient"?false:true;
      menuItem.subMenu.forEach(subMenuItem => {
        subMenuItem.show=role=="Patient"?false:true;
      });
    })
  }*/
  updateMenuBasedOnRole(role: string) {
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

    this.menuNavbar.forEach((menuItem, index) => {
        menuItem.show = role == 'Patient' ? false : true;
      });
  }
}
