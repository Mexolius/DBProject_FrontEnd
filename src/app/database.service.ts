import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private baseURL: string;
  private countriesURL: string;
  private daysURL: string;
  private summaryURL: string;
  private differenceURL: string;


  constructor(private http: HttpClient) {
    this.baseURL='http://localhost:8080';
    this.countriesURL='/countries';
    this.summaryURL='/summary/total'
  }

  public getCountryNames(): Promise<CountryInfo[]>
  {
    return this.http.get<CountryInfo[]>(this.baseURL.concat(this.countriesURL)).pipe(
      map(data=>
        data.map(info=>
          new CountryInfo(info.countryId,info.countryName,info.epidemyDays.slice(0,1))
          ).sort((a,b)=>{ return a.countryName<b.countryName?-1:1; })
        )
      ).toPromise();
  }

  public getTotalSummary(param: string) : Promise<GraphCompatibleData>
  {
    return this.http.get<EpidemyDay[]>(this.baseURL.concat(this.summaryURL)).pipe(
      map(data=>
        new GraphCompatibleData(true, "Summary of " + param + " by date", data.map(info=>info.date),data.map(day=>day[param]))
        )
      ).toPromise();

  }

  public getCountryInfo(countryName: string) : Promise<EpidemyDay[]>
  {
    countryName=countryName.charAt(0).toLocaleUpperCase()+countryName.substring(1);
    return this.http.get<countryDetail>(this.baseURL.concat(this.summaryURL).concat('/'+countryName)).pipe(
      map(data=>data.days)
      ).toPromise();
  }
}

export class CountryInfo
{
  constructor(  countryId: string,
    countryName: string,
    epidemyDays: Array<EpidemyDay>
  )
  {
    this.countryId=countryId;
    this.countryName=countryName;
    this.epidemyDays=epidemyDays;
  }
  countryId: string;
  countryName: string;
  epidemyDays: Array<EpidemyDay>;
}

export class EpidemyDay
{
  date:string;
  confirmed: number;
  recovered: number;
  deaths: number;
}

class countryDetail{
  name: string;
  days: Array<EpidemyDay>;
}

export class GraphCompatibleData
{
    animationEnabled: Boolean;
    backgroundColor: string;
    titleText: string;
    lables: Array<string>;
    data: Array<number>
    type: string;
    colorSet:string;

    constructor(aniEnabled: Boolean, title:string, labels: Array<string>, data: Array<number>, type: string = "column")
    {
      this.animationEnabled=aniEnabled
      this.backgroundColor="rgba(255,255,255,0)"
      console.log(labels);
      this.lables=labels;
      this.titleText=title;
      this.data=data;
      console.log(data);
      this.type=type;
    }

    private prepDArr()
    {
      var ret = new Array();
      for(var i=0;i<this.lables.length;i++)
      {
        var day = {y:this.data[i], label: this.lables[i]}
        if (day.y>20000)ret.push(day);
      }
      return ret.reverse();
    }

    public toDataObject(colorSet: string)
    {
      var dataArray = this.prepDArr();
      var ret = {
          colorSet: colorSet,
          animationEnabled: this.animationEnabled,
          backgroundColor: this.backgroundColor,
          title: {
            text: this.titleText
          },
          data:[{
              type: this.type,
              dataPoints: dataArray
          }]
      }
      console.log(ret);
      return ret;
    }
}