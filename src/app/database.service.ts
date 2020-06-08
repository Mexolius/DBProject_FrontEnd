import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, concat } from 'rxjs';
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
  private countryNamesURL;
  private countryNames: Array<String>;


  constructor(private http: HttpClient) {
    this.baseURL='http://localhost:8080';
    this.countriesURL='/countries';
    this.summaryURL='/summary';
    this.daysURL='/days';
    this.differenceURL='/difference';
    this.countryNamesURL='/countryNames'

  }

  public getCountryNames(): Promise<String[]>
  {
    if(this.countryNames===undefined)
    {
      return this.http.get<String[]>(this.baseURL.concat(this.countryNamesURL)).toPromise().then(data=>this.countryNames=data);
    } 
    else return new Promise((res,rej)=>
    {
      res(this.countryNames)
    });
    
  }

  public countryExists(name: string): Promise<Boolean>
  {
      return this.http.get<String[]>(this.baseURL.concat(this.countryNamesURL)).pipe(map(data=>{
        return data.includes(name);
      })).toPromise();
  }

  public getTotalSummary() : Observable<EpidemyDay[]>
  {
    return this.http.get<EpidemyDay[]>(this.baseURL.concat(this.summaryURL).concat('/total'));
  }

  public getCurrentSummary() : Observable<EpidemyDay>
  {
    return this.http.get<EpidemyDay>(this.baseURL.concat(this.summaryURL).concat('/current'));
  }

  public getCountryInfo(countryName: string) : Promise<EpidemyDay[]>
  {
    countryName.replace(/^\s+/g, '').replace(/^\s+|\s+$/g, '')
    countryName=countryName.charAt(0).toLocaleUpperCase()+countryName.substring(1);
    var url = this.baseURL.concat(this.countriesURL).concat('/'+countryName);
    return this.http.get<countryDetail>(url)
      .pipe( map(data=> data.epidemyDays.sort((a,b)=>a.date<b.date?1:-1)))
      .toPromise();
  }

  public getCountryDifference(countryName: string) : Promise<EpidemyDay[]>
  {
    countryName.replace(/^\s+/g, '').replace(/^\s+|\s+$/g, '')
    countryName=countryName.charAt(0).toLocaleUpperCase()+countryName.substring(1);
    var url = this.baseURL.concat(this.countriesURL).concat('/'+countryName).concat(this.daysURL).concat(this.differenceURL);
    return this.http.get<EpidemyDay[]>(url)
      .pipe(map(data=> data.sort((a,b)=>a.date<b.date?1:-1)))
      .toPromise();
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
  epidemyDays: Array<EpidemyDay>;
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
      this.lables=labels;
      this.titleText=title;
      this.data=data;
      this.type=type;
    }

    private prepDArr()
    {
      var ret = new Array();
      for(var i=0;i<this.lables.length;i++)
      {
        var day = {y:this.data[i], label: this.lables[i]}
        if(day.y>0)ret.push(day);
      }
      return ret.reverse();
    }

    public toDataObject(colorSet: string="")
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
      return ret;
    }
}