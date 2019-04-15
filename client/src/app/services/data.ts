import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class GetData {
  constructor(private http: Http) { }
  getData() {
    return this.http.get("https://api.iextrading.com/1.0/stock/aapl/chart/1d").map(res => res.json());
  }
}
