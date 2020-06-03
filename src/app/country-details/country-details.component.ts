import { Component, OnInit } from '@angular/core';
import * as CanvasJS from 'src/assets/canvasjs.min';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { DatabaseService, GraphCompatibleData } from '../database.service';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-country-details',
  templateUrl: './country-details.component.html',
  styleUrls: ['./country-details.component.scss']
})
export class CountryDetailsComponent implements OnInit {

  infChart;
  recChart;
  dthChart;
  country;

  labels: Array<string>;
  conf: Array<number>;
  rec: Array<number>;
  ded: Array<number>;

  constructor(private route: ActivatedRoute, private db: DatabaseService, private router: Router)
  {
	this.router.events.pipe(
		filter((event: RouterEvent) => event instanceof NavigationEnd)
	  ).subscribe(() => {
		this.setCountry();
		this.renderGraphs();
	  });
	  this.setCountry();
  }

	private setCountry() :void
	{
    	this.route.paramMap.subscribe(pars=>
		{
		  this.country = pars.get(pars.keys[0]);
		  this.country=this.country.charAt(0).toLocaleUpperCase()+this.country.substring(1);
		});
	}

	private renderGraphs():void
	{
		this.db.getCountryInfo(this.country).then(data=>{
			console.log(data);
			this.labels = data.map(day=>day.date);
			this.conf = data.map(day=>day.confirmed);
			this.rec = data.map(day=>day.recovered);
			this.ded = data.map(day=>day.deaths);

			/*console.log(this.labels);
			console.log(this.conf);
			console.log(this.rec);
			console.log(this.ded);*/


			this.infChart = new CanvasJS.Chart("infectionsPerDay", new GraphCompatibleData(true,"Confirmed Cases in " + this.country,this.labels,this.conf,"column").toDataObject());
			this.recChart = new CanvasJS.Chart("recoveriesPerDay", new GraphCompatibleData(true,"Recoveries in " + this.country,this.labels,this.rec,"column").toDataObject());
			this.dthChart = new CanvasJS.Chart("deathsPerDay", new GraphCompatibleData(true,"Deaths in " + this.country,this.labels,this.ded,"column").toDataObject());
  
		  
			this.infChart.render();
			this.recChart.render();
			this.dthChart.render();
  
		}).catch(error=>
			{
				console.log(error);
				this.router.navigate(['countryNotFound/'+this.country]);
			});
	}

  	ngOnInit() {
		this.renderGraphs();
	}


}
