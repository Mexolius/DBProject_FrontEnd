import { Component, OnInit } from '@angular/core';
import { DatabaseService, EpidemyDay, GraphCompatibleData } from '../database.service';
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

	data: Array<EpidemyDay>;
	currentDay: EpidemyDay;
	currnet: string;


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
	this.currnet='confirmed';

   }

   private drawPreviousSummary()
   {
	this.infChart=new CanvasJS.Chart("Previous", new GraphCompatibleData(true,'Total Summary of ' + this.currnet + ' by date',
	this.data.map(record=>record.date.substr(0,10)),this.data.map(record=>record[this.currnet]),"column").toDataObject(this.currnet));
	this.infChart.render();
   }

   private drawCurrentSummary()
   {
	this.recChart=new CanvasJS.Chart("Current", new GraphCompatibleData(true,'Current Summary for ' + this.currentDay.date.substr(0,10),
	['confirmed','recovered','deaths'],[this.currentDay.confirmed,this.currentDay.recovered,this.currentDay.deaths],"pie").toDataObject());
	this.recChart.render();
   }


   private getData()
   {
		this.db.getTotalSummary().subscribe(days=>{
			this.data=days;
			this.drawPreviousSummary();
		})
		this.db.getCurrentSummary().subscribe(day=>{
			this.currentDay=day;
			this.drawCurrentSummary();
		})
   }

  ngOnInit(): void {
	this.getData();

  }

  public setgraph(name: string)
  {
	  this.currnet=name;
	  this.drawPreviousSummary();
  }

}
