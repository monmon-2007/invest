import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: any;
  authToken: String;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authToken = localStorage.getItem('token');

    this.authService.getProfile(this.authToken).subscribe(profile => {
      this.user = profile.user;
      console.log("Hello World!" + this.authToken)
      console.log(this.user)
    });

    this.authService.test('unh').subscribe(data => {
      console.log(data)
      
    });


  }
}
