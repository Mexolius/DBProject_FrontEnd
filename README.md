# DBProject Frontend
A frontend part of the project based in the repository:
https://github.com/Mexolius/DB_Project

This part focuses on the extraction of data from the API created in hibernate and presentation of data in the web browser.
The web page is realised in Angular CLI version 9.1.4 and shows only a small part of possible data analysys

# Graphs
Grapths in the project are created via CanvasJS library which is compatible with Angular and easy to use.

# Data
Data is fetched from the API by sending a GET request through HTTP. Most of the time it's passed in the form of promise for simplicity, but for presentational purposes there is an instance of observable usage.

# Components and Services
Below you'll find a brief look at the working principles of components and services used in the project
### Database service
The service is responsible for fetching data from the API created with Hibernate and Spring. Most of the requests are passed directly from the database, although some of them aren't sorted by default. In that case the sorting happens in the service as well. Ther general structure of a request:
```
return this.http.get<EpidemyDay[]>(url)
    .pipe(map(data=> data.sort((a,b)=>a.date<b.date?1:-1)))
    .toPromise();
```
Since the data doesn't change untill the API is reset it's more convinient to return the data as a Promise rather than an Observable.

### Home component
Website homepage.

### Navbar component
Navigation menu located at the top of the screen on most of the pages. Besides allowing the user to enter further navigation-related pages it also allows for a simple string-based search. If the searched phrase is no a valid country (from the API perspective) it redirects you to the 'country not found' page.

### Country not found component
Simplistic view to display in case of a failed string search or direct and incorect detail request. It is mostly a placeholder and only allows for a homepage redirect

### Country-list component
A simple listing component that allows you to choose a country of interest.

### Country detail component
A detailed view of the Covid-related statistics of a chosen country. The user can choose from 6 graphs showing him the overall (sumaric) or daily (increase) of confirmed cases/recoveris/deaths.

### Countries component
It works as a worldwide summary component, You can display a sumaric view of the above mentioned 3 statistics, or compare the overall sum of them via a pie chart.
