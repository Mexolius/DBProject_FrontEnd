import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-country-not-found',
  templateUrl: './country-not-found.component.html',
  styleUrls: ['./country-not-found.component.scss']
})
export class CountryNotFoundComponent implements OnInit {

  searchResult: string;

  constructor(private route: ActivatedRoute, private router: Router)
  {
    this.route.paramMap.subscribe(pars=>
      {
        this.searchResult = pars.get(pars.keys[0]);
      }).unsubscribe();

  }

  ngOnInit(): void {
  }

  logIt()
  {
    this.router.navigate(['/'])
  }

}
