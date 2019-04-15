import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map';
const requests = {
  username:  "mario123",
  stock: "CDNA"
};
@Injectable()
export class AuthService {

  domain = 'http://localhost:8080/authentication/user';
  domains = 'http://localhost:8080';
  logindomain = 'http://localhost:8080/authentication/login';
  profiledomain = 'http://localhost:8080/authentication/profile';
  domain1 = 'http://localhost:8080/authentication/watchList';
 domain12 = 'http://localhost:8080/authentication/getWatchList'


  authToken: String;
  user: any;
  options: RequestOptions;
  private value: any

  constructor(private http: Http) { }

  createAuthenticationHeaders(token) {
    this.authToken = localStorage.getItem('token');
    this.options = new RequestOptions({
      headers: new Headers({
        'content-type': 'application/json',
        'authorization': token
      })
    });
  }

  tokenGetter() {
    return localStorage.getItem('token');
  }

  registerUser(user) {
    return this.http.post(this.domain, user).map(res => res.json());
  }

  checkEmail(email) {
    return this.http.get(this.domains + '/authentication/checkEmail/' + email).map(res => res.json());
  }

  checkUsername(username) {
    return this.http.get(this.domains + '/authentication/checkUsername/' + username).map(res => res.json());
  }

  login(user) {
    return this.http.post(this.logindomain, user).map(res => res.json());
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();

  }

  storeUserData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  checkToken() {
    if (!localStorage.getItem('token')) {
      return false;
    } else {
      return true;
    }
  }

  getProfile(token) {
    this.createAuthenticationHeaders(token);
    console.log(this.http.get(this.profiledomain, this.options).map(res => res.json()))
    return this.http.get(this.profiledomain, this.options).map(res => res.json());
  }


  addToWatchList(ticker){
    this.value = localStorage.getItem('user')
    this.value = JSON.parse(this.value)
    var obj = {
      "username":this.value.username,
      "stock":ticker
    }
    return this.http.post(this.domain1,obj).map(res => res.json());
  }
  getWatchList(){
    this.value = localStorage.getItem('user')
    this.value = JSON.parse(this.value)
    var obj = {
      "username":this.value.username,
    }
    return this.http.post(this.domain12,obj).map(res => res.json());
  }

  test(ticker){
    console.log(ticker)
    var x = {
      "ticker":"unh",
      "previous":123
    }
    return this.http.get("https://api.iextrading.com/1.0/stock/"+ticker+"/chart/1d").map(res => res.json());

  }
  test2(){
    var x = {
      "ticker":"unh",
      "previous":123
    }
    return this.http.get("https://api.iextrading.com/1.0/stock/algn/chart/1d").map(res => res.json());

  }
  getQuote(ticker){
    return this.http.get("https://api.iextrading.com/1.0/stock/"+ticker+"/batch?types=quote").map(res => res.json());
  }
}
