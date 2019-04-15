import { Component, OnInit,OnChanges,NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
const socket = require('socket.io-client')('https://ws-api.iextrading.com/1.0/tops')
import { ActivatedRoute } from '@angular/router';



declare const TradingView: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  form: FormGroup;
  test = "Mina";
  test2 = "Gadallah"
  message:any;
  ticker:any;
  private watchListItems: any
  private fullWatchListItems = []
  private temp=[]
  constructor(private formBuilder: FormBuilder,private ngZone: NgZone,private authService: AuthService,private activeRoute: ActivatedRoute) {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      search: ['', Validators.compose([Validators.required])]
    });
  }

  ngOnChanges(){
  }

  ngOnInit() {

    this.getWatchList();
  }

  updateTradingView(ticker: String) {
    // const tradingView = new TradingView({
    //   'container_id': 'tradingview-widget-container',
    //   'width': 425,
    //   'height': 410,
    //   'symbol': 'NASDAQ:AAPL',
    //   'locale': 'en',
    //   'interval': '1D'
    // });

    const tradingView = new TradingView.widget({
      'container_id': 'myWidgetContainer',
      'width': 550,
      'height': 410,
      'symbol': ticker,
      'interval': 'D',
      'timezone': 'Etc/UTC',
      'theme': 'Dark',
      'style': '1',
      'locale': 'en',
      'toolbar_bg': '#f1f3f6',
      'enable_publishing': false,
      'allow_symbol_change': true,
      'hideideas': true
    });
  }

  onSearchSubmit() {
    this.ticker = this.form.get('search').value;
    this.updateTradingView(this.form.get('search').value);
  }
  addToWatch(){
    this.authService.addToWatchList(this.ticker).subscribe(data=>console.log(data))
  }
  counter = 0

   getWatchList(){
    return this.authService.getWatchList().subscribe(data=>{
      this.watchListItems = data
      this.watchListItems.sort()
      for(var i=0;i<data.length;i++){
      this.getStockData(this.watchListItems[i],this.fullWatchListItems)

      console.log(this.fullWatchListItems)
      }

      this.StreamData(this.watchListItems)

    })

  }

  /**
  Takes the ticker and global list
  **/
  async getStockData(ticker,state){
    await this.authService.test(ticker).subscribe(data=>{
      data = this.dataChartRefactor(data)
      //this.authService.getQuote(ticker).subscribe()
      var x ={
        "ticker": ticker,
        "data":   data,
        "price": data[data.length-1].average
      }
      this.getQuoteData(ticker,x)
      state.push(x)
    })
  }

  /*
    Gets a qoute
  */
  async getQuoteData(ticker,state){
    await this.authService.getQuote(ticker).subscribe(data=>{
      state.quote = data;

      var change = (state.price - state.quote.quote.previousClose)/state.quote.quote.previousClose
      change = change * 100;
     state.quote.quote.extendedChange = change.toPrecision(2);

    })
  }

  /**
    prep data to be charted
  **/
  dataChartRefactor(data){
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
        }
        return data;
  }

  /**
    stock Live stream
  **/
  StreamData(StockList){
    var topic="";
    for(var i = 0; i < StockList.length; i++){
      topic+=StockList[i]+',';
    }

    socket.on('message', (message) => {//this.message = message
      this.message = JSON.parse(message)
      this.message = this.message
      this.ngZone.run( () => {
          this.message;
          //this.fullWatchListItems[i].price
        for(var i = 0; i < this.fullWatchListItems.length; i++){
          if(this.fullWatchListItems[i].ticker.toUpperCase()==this.message.symbol)
            this.fullWatchListItems[i].price = this.message.lastSalePrice
           var change = (this.fullWatchListItems[i].price - this.fullWatchListItems[i].quote.quote.previousClose)/this.fullWatchListItems[i].quote.quote.previousClose
           change = change * 100;
          this.fullWatchListItems[i].quote.quote.extendedChange = change.toPrecision(2);
          //  console.log(this.fullWatchListItems[i])
        }
       });
    })
    // Connect to the channel
    socket.on('connect', () => {

      // Subscribe to topics (i.e. appl,fb,aig+)
      socket.emit('subscribe', topic)
      console.log(topic)
      // Unsubscribe from topics (i.e. aig+)
      //socket.emit('unsubscribe', 'aig+')
    })
  }

}
