import { Component, OnInit } from '@angular/core';
import * as CanvasJS from 'src/assets/canvasjs.min';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { DatabaseService, GraphCompatibleData, EpidemyDay } from '../database.service';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-country-details',
  templateUrl: './country-details.component.html',
  styleUrls: ['./country-details.component.scss']
})
export class CountryDetailsComponent implements OnInit {

  days: Array<EpidemyDay>;
  difference: Array<EpidemyDay>;
  current: string;
  current2: string;

  infChart;
  recChart;
  country;

  RoutingRefresh: Subscription;

  labels: Array<string>;
  conf: Array<number>;
  rec: Array<number>;
  ded: Array<number>;

  constructor(private route: ActivatedRoute, private db: DatabaseService, private router: Router)
  {
	CanvasJS.addColorSet("confirmed",
	[
		"#3B71EC",
		"#2C53AD"              
	]);
	CanvasJS.addColorSet("recovered",
	[
		"#36AD2C",
		"#45E238"    
	]);
	CanvasJS.addColorSet("deaths",
	[
		"#AD2C2C",
		"#E23838"  
	]);
	this.RoutingRefresh = this.router.events.pipe(
		filter((event: RouterEvent) => event instanceof NavigationEnd)
	  ).subscribe(() => {
		this.setCountry()
		.then(exists=>
		{
			if(exists)
			{
				console.log(exists);
				console.log('drawing');
				this.renderGraphs();
			}
		})
		.catch(error=>console.log(error));
	  });
	  this.current='confirmed';
	  this.current2='confirmed';

  }

	private async setCountry() :Promise<Boolean>
	{
		return new Promise((res,rej)=>{
			this.db.getCountryNames()
			let a = this.route.paramMap.subscribe(pars=>
			{
			  this.country = pars.get(pars.keys[0]);
			  this.country=this.country.charAt(0).toLocaleUpperCase()+this.country.substring(1);
			  
			  this.db.countryExists(this.country).then(exists=>{
				if(!exists) 
				{
					this.RoutingRefresh.unsubscribe();
					a.unsubscribe();
					this.router.navigate(['/countryNotFound/'+this.country]);
					res(false);
				}
				else res(true);
			  });
			});
			a.unsubscribe();
		});
	}

	private drawGraph1()
	{
	 this.infChart=new CanvasJS.Chart("infectionsPerDay", new GraphCompatibleData(true,'Total Summary of ' + this.current + ' for '+this.country+ ' by date',
	 this.days.map(record=>record.date.substr(0,10)),this.days.map(record=>record[this.current]),"column").toDataObject(this.current));
	 if(this.infChart!=undefined)
	 this.infChart.render();
	}

	private drawGraph2()
	{
	 this.recChart=new CanvasJS.Chart("recoveriesPerDay", new GraphCompatibleData(true,'Total Summary of NEW ' + this.current2 + ' for '+this.country+ ' by date',
	 this.difference.map(record=>record.date.substr(0,10)),this.difference.map(record=>record[this.current2]),"column").toDataObject(this.current2));
	 if(this.recChart!=undefined)
	 this.recChart.render();
	}
 

	private async renderGraphs(): Promise<void>
	{
		this.db.getCountryInfo(this.country).then(data=>{
			this.days=data; 
			this.drawGraph1();
		});
		this.db.getCountryDifference(this.country).then(data=>{
			this.difference=data; 
			this.drawGraph2();
		});
	}

  	ngOnInit() {
		this.setCountry()
		.then(exists=>
		{
			if(exists) this.renderGraphs();
		})
		.catch(error=>console.log(error));
	}

	public setgraph(name: string)
	{
		console.log('setting');
		this.current=name;
		if(this.days)this.drawGraph1();
	}

	public setGraph2(name: string)
	{
		console.log('setting');

		this.current2=name;
		if(this.difference)this.drawGraph2();
	}


}
