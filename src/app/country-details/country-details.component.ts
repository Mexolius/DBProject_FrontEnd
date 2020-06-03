import { Component, OnInit } from '@angular/core';
import * as CanvasJS from 'src/assets/canvasjs.min';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from '../database.service';


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

  constructor(private route: ActivatedRoute, private database: DatabaseService, private router: Router)
  {
    this.route.paramMap.subscribe(pars=>
      {
        this.country = pars.get(pars.keys[0]);
		this.country=this.country.charAt(0).toLocaleUpperCase()+this.country.substring(1);

	  });

  }

  ngOnInit() {
		this.infChart = new CanvasJS.Chart("infectionsPerDay", {
    animationEnabled: true,
    backgroundColor: "rgba(255,255,255,0)",
		title: {
			text: 'Infections in ' + this.country + ' by date'
		},
		data: [{
			type: "line",
			dataPoints: [
				{ y: 71, label: "Apple" },
				{ y: 43, label: "Mango" },
				{ y: 50, label: "Orange" },
				{ y: 34, label: "Banana" },
				{ y: 95, label: "Pineapple" },
				{ y: 44, label: "Pears" },
				{ y: 54, label: "Grapes" },
				{ y: 54, label: "Lychee" },
				{ y: 14, label: "Jackfruit" }
			]
    },
    {
    type: "scatter",
    dataPoints: [
      { y: 71, label: "Apple" },
      { y: 55, label: "Mango" },
      { y: 50, label: "Orange" },
      { y: 65, label: "Banana" },
      { y: 95, label: "Pineapple" },
      { y: 68, label: "Pears" },
      { y: 28, label: "Grapes" },
      { y: 34, label: "Lychee" },
      { y: 14, label: "Jackfruit" }
    ]
  }]
  });

  this.recChart = new CanvasJS.Chart("recoveriesPerDay", {
    animationEnabled: true,
		title: {
			text: 'Recoveries in ' + this.country + ' by date'
    },
    backgroundColor: "rgba(255,255,255,0)",
		data: [{
			type: "bar",
			dataPoints: [
				{ y: 71, label: "Apple" },
				{ y: 55, label: "Mango" },
				{ y: 50, label: "Orange" },
				{ y: 65, label: "Banana" },
				{ y: 95, label: "Pineapple" },
				{ y: 68, label: "Pears" },
				{ y: 28, label: "Grapes" },
				{ y: 34, label: "Lychee" },
				{ y: 14, label: "Jackfruit" }
			]
		}]
  });

  this.dthChart = new CanvasJS.Chart("deathsPerDay", {
    animationEnabled: true,
    maintainAspectRatio: true,
    aspectRatio:1.5,
		title: {
			text: 'Deaths in ' + this.country + ' by date'
    },
    backgroundColor: "rgba(255,255,255,0)",
		data: [{
			type: "line",
			dataPoints: [
				{ y: 71, label: "Apple" },
				{ y: 55, label: "Mango" },
				{ y: 50, label: "Orange" },
				{ y: 65, label: "Banana" },
				{ y: 95, label: "Pineapple" },
				{ y: 68, label: "Pears" },
				{ y: 28, label: "Grapes" },
				{ y: 34, label: "Lychee" },
				{ y: 14, label: "Jackfruit" }
			]
		}]
  });

		
  this.infChart.render();
  this.recChart.render();
  this.dthChart.render();
	}
}
