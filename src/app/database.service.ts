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


  constructor(private http: HttpClient) {
    this.baseURL='http://localhost:8080';
    this.countriesURL='/countries';
    this.summaryURL='/summary';
    this.daysURL='/days';
    this.differenceURL='/difference';
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

  public getTotalSummary() : Observable<EpidemyDay[]>
  {
    return this.http.get<EpidemyDay[]>(this.baseURL.concat(this.summaryURL).concat('/total'));
  }

  public getCurrentSummary() : Observable<EpidemyDay>
  {
    return this.http.get<EpidemyDay>(this.baseURL.concat(this.summaryURL).concat('/current'));
  }

  public getCountryInfo(countryName: string) : Observable<EpidemyDay[]>
  {
    countryName=countryName.charAt(0).toLocaleUpperCase()+countryName.substring(1);
    if(countryName[0]==' ') countryName=countryName.substring(1);
    var url = this.baseURL.concat(this.countriesURL).concat('/'+countryName);
    console.log(url)
    return this.http.get<countryDetail>(url).pipe(
      map(data=> 
        {
          if(data==null)
          {
            return null;
          } 
          return data.epidemyDays.sort((a,b)=>a.date<b.date?1:-1)
        }));

  }

  public getCountryDifference(countryName: string) : Observable<EpidemyDay[]>
  {
    countryName=countryName.charAt(0).toLocaleUpperCase()+countryName.substring(1);
    if(countryName[0]==' ') countryName=countryName.substring(1);
    if(countryName[countryName.length-1]==' ') countryName=countryName.substring(0,countryName.length-1);
    var url = this.baseURL.concat(this.countriesURL).concat('/'+countryName).concat(this.daysURL).concat(this.differenceURL);
    console.log(url)
    return this.http.get<EpidemyDay[]>(url).pipe(
      map(data=> 
        {
          if(data==null)
          {
            return null;
          }
          return data.sort((a,b)=>a.date<b.date?1:-1)
        }));

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