import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})



export class BackendService {
  // searchOption:any=[]
  // public postsData:any
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: 'my-auth-token'
    })
  };
  private url = 'http://localhost:3000/users';

  constructor(private httpClient: HttpClient) { }
  
  getPosts(){
    return this.httpClient.get(this.url);
  }

  /** POST: add a new data to the database */
  addData(data: any): Observable<any> {
  return this.httpClient.put<any>(`${this.url}/${data.id}`, data, this.httpOptions)
  }

}
