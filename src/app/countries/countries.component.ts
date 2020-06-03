import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DatabaseService } from '../database.service';
import * as CanvasJS from 'src/assets/canvasjs.min';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})
export class CountriesComponent implements OnInit {
	public infChart;
	public recChart;
	public dthChart;

  constructor(private db: DatabaseService) {
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
   }

  ngOnInit(): void {
	  this.db.getTotalSummary('confirmed').then(obj=>
		{
			this.infChart=new CanvasJS.Chart("sumInfected", obj.toDataObject("confirmed"));
			this.infChart.render();
		});
		this.db.getTotalSummary('recovered').then(obj=>
		{
			this.infChart=new CanvasJS.Chart("sumRecovered", obj.toDataObject("recovered"));
			this.infChart.render();
		});
		this.db.getTotalSummary('deaths').then(obj=>
		{
			this.infChart=new CanvasJS.Chart("sumDeaths", obj.toDataObject("deaths"));
			this.infChart.render();
		});
  }

}
