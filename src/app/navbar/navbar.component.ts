import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  appTitle: string = 'myapp';



  constructor(private router: Router) { }

  onSubmit(name: string) {
    name=name.charAt(0).toLocaleUpperCase()+name.substring(1);
    this.router.navigate(['countries/'+name]);
  }

  ngOnInit(): void {
  }

}
