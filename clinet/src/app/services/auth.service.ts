import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http'
import 'rxjs/add/operator/map'
//import { tokenNotExpired } from '@auth0/angular-jwt';



@Injectable()
export class AuthService {
domain = "http://localhost:8080/authentication/user"
domains = "http://localhost:8080"
logindomain = "http://localhost:8080/authentication/login"
profiledomain = "http://localhost:8080/authentication/profile"
authToken;
user;
options;



  constructor(
    private http: Http,
  ) { }

createAuthenticationHeaders(){
  this.authToken = localStorage.getItem('token')
  this.options = new RequestOptions({
    headers: new Headers({
      'content-type':'application/json',
      'authorization':this.authToken
    })
  })
}

tokenGetter() {
  return localStorage.getItem('token');
}

  registerUser(user){
    return this.http.post(this.domain,user).map(res=>res.json())
  }

  checkEmail(email){
    return this.http.get(this.domains+'/authentication/checkEmail/'+ email).map(res=>res.json())
  }
  checkUsername(username){
    return this.http.get(this.domains+'/authentication/checkUsername/'+ username).map(res=>res.json())
  }

login(user){
  return this.http.post(this.logindomain,user).map(res=>res.json())
}
logout(){
  this.authToken = null
  this.user=null
  localStorage.clear()

}
  storeUserData(token,user){
    localStorage.setItem('token',token)
    localStorage.setItem('user',JSON.stringify(user))
    this.authToken =token
    this.user = user
  }
  checkToken(){
    if(!localStorage.getItem('token')){
      return false;
    }else{
      return true;
    }
  }

  getProfile(){
    this.createAuthenticationHeaders();
    return this.http.get(this.profiledomain,this.options).map(res => res.json())
  }





}
