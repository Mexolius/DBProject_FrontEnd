import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.scss']
})
export class CountryListComponent implements OnInit {

  public headers;
  public groupedData=new Array();

  constructor(private db: DatabaseService, private router: Router) {
    this.headers=['0','1','2','3'];
    this.db.getCountryNames().then(data=>{
      for(var i=0;i<data.length;i+=4)
      {
        var obj={};
        for(var j=0;j<4;j++)
        {
          if(i+j<data.length)
          {
            obj[j.toString()]=data[i+j];
          }
        }
        this.groupedData.push(obj);
      }
    })
  }

  ngOnInit(): void {
    
  }

  public handleClick(e: string)
  {
    this.router.navigate(['countries/'+e.replace(/^\s+/g, '').replace(/^\s+|\s+$/g, '')]);
  }

}
