import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Dashboard1Component } from "./dashboard1/dashboard1.component";


/*const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard1",
    pathMatch: "full",
  },
  {
    path: "dashboard1",
    component: Dashboard1Component,
  },

  //{ path: "**", component: Page404Component },
];*/

@NgModule({
 // imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
