import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  readonly fileurl="http://localhost:61866/api";
  constructor(private http:HttpClient) { }    

  updatefile(val:any)
  {
    return this.http.put(this.fileurl+'/Metricmaster',val);
  }
}
