import { Component, OnInit,AfterViewInit   } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
declare const TradingView: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  form: FormGroup;

  constructor(private formBuilder:FormBuilder) {
    this.createForm()

   }

   createForm(){
     this.form = this.formBuilder.group({
       search:['',Validators.compose([Validators.required])]
     })
   }

  ngAfterViewInit(ticker) {
  new TradingView({
    "container_id": "tradingview-widget-container",
    "width": 425,
    "height": 410,
    "symbol": "NASDAQ:AAPL",
    "locale": "en",
    "interval": "1D"
  })
/*  new TradingView.widget({
    "container_id": "myWidgetContainer",
    "width": 550,
    "height": 410,
    "symbol": ticker,
    "interval": "D",
    "timezone": "Etc/UTC",
    "theme": "Dark",
    "style": "1",
    "locale": "en",
    "toolbar_bg": "#f1f3f6",
    "enable_publishing": false,
    "allow_symbol_change": true,
    "hideideas": true
  });
*/
}
onSearchSubmit(){
  console.log(this.form.get('search').value)
  this.ngAfterViewInit(this.form.get('search').value)
}

  ngOnInit() {
  }


}
