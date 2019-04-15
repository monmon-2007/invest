import { Component } from '@angular/core';
import { AuthService } from '../../src/app/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  passData: any
  passData2: any
  constructor(private authService: AuthService) {
  }
  ngOnInit() {
    this.authService.test('unh').subscribe(data => {
      var temp:number;
      for (var i = 0; i < data.length; i++) {
            data[i].date = new Date(
            data[i].date.substring(0, 4)+'-'+
            data[i].date.substring(4, 6)+'-'+
            data[i].date.substring(6, 10)+ ' '+data[i].minute)

            if(data[i].average != -1)
              temp = data[i].average;
            else
              data[i].average =temp;

            data[i].label = "red";
          }
          var dataObject = {
            "chart":data,

          }
          this.passData = data;
    });

    this.authService.test2().subscribe(data => {
      var temp:number;
      for (var i = 0; i < data.length; i++) {
            data[i].date = new Date(
            data[i].date.substring(0, 4)+'-'+
            data[i].date.substring(4, 6)+'-'+
            data[i].date.substring(6, 10)+ ' '+data[i].minute)

            if(data[i].average != -1)
              temp = data[i].average;
            else
              data[i].average =temp;

            data[i].label = "red";
          }
          var dataObject = {
            "chart":data,

          }
          this.passData2 = data;
    });

  }

}
