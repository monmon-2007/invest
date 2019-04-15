import { Component, OnInit,Input, OnChanges, ViewChild, ElementRef, ViewEncapsulation  } from '@angular/core';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import { STOCKS } from '../../services/stocks';

@Component({
  selector: 'app-stock-bar',
  templateUrl: './stock-bar.component.html',
  styleUrls: ['./stock-bar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StockBarComponent implements OnInit {
  title = 'Line Chart';
  @Input('customTitle') customTitle: Array<any>;
  @ViewChild('chart') private chartContainer: ElementRef;


  private red= []
  private green=[]
  private baseLine=[]
  private margin = {top: 20, right: 20, bottom: 30, left: 50};
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private color: any;
  private svg: any;
  private line: d3Shape.Line<[number, number]>;
  private line2: d3Shape.Line<[number, number]>;
  private chart:any;
  private xScale: any;
private yScale: any;
private colors: any;
private xAxis: any;
private yAxis: any;


    constructor() {
     this.width = 120 - this.margin.left - this.margin.right;
     this.height = 80 - this.margin.top - this.margin.bottom;

    }

    ngOnInit() {

//  this.createCharts()


   this.initSvg();
   this.initAxis();
   this.drawLine();


    //this.drawAxis();
  }
private initSvg() {
    const element = this.chartContainer.nativeElement;

    this.svg = d3.select(element).append('svg')
    .attr('width', this.width)
    .attr('height', this.height);

}
private initAxis() {
    this.x = d3Scale.scaleTime().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.x.domain(d3Array.extent(this.customTitle, (d) => d.date ));
    this.y.domain(d3Array.extent(this.customTitle, (d) => d.average ));
}
private drawAxis() {

       this.svg.append('g')
           .attr('class', 'axis axis--x')
           .attr('transform', 'translate(0,' + this.height + ')')
           .call(d3Axis.axisBottom(this.x));

       this.svg.append('g')
           .attr('class', 'axis axis--y')
           .call(d3Axis.axisLeft(this.y))
           .append('text')
           .attr('class', 'axis-title')
           .attr('transform', 'rotate(-90)')
           .attr('y', 6)
           .attr('dy', '.71em')
           .style('text-anchor', 'end')
           .text('Price ($)');
   }


   private drawLine() {

       this.line = d3Shape.line()
       .defined(function(d:any) {
         if(d.average == null)
            return false
          else
            return true;
        })
          .x( (d: any) => this.x(d.date) )
          .y( (d: any) => this.y(d.average) );

          this.line2 = d3Shape.line()
          .defined(function(d:any) {
            if(d.average == null)
               return false
             else
               return true;
           })
             .x( (d: any) => this.x(d.date) )
             .y( (d: any) => this.y(d.average) );


var temp ={"date":null,"average":null}

var i;
     for(i =0; i<this.customTitle.length;i++){
        this.baseLine.push({"date":this.customTitle[i].date,"average":267})

       if(this.customTitle[i].average>=267){
         this.green.push(this.customTitle[i])
         this.red.push(temp)

         if(i>0 && i<this.customTitle.length-1){
           if(this.customTitle[i-1].average<267){
             this.red[i-1]={"date":this.customTitle[i-1].date,"average":267}
             this.green[i-1]={"date":this.customTitle[i-1].date,"average":267}
           }
           if(this.customTitle[i+1].average<267){
             this.red[i]={"date":this.customTitle[i].date,"average":267}
           }
         }
       }
       else{
         this.red.push(this.customTitle[i])
         this.green.push(temp)
       }

     }





     this.svg.append('path')
     .datum(this.green)
    .attr("fill", "none")
    .attr("stroke-width", 1)
    .attr("d", this.line)
    .attr("stroke", "green");

    this.svg.append('path')
    .datum(this.red)
   .attr("fill", "none")
   .attr("stroke-width", 1)
   .attr("d", this.line)
   .attr("stroke", "red");

   this.svg.append('path')
   .datum(this.baseLine)
  .attr("fill", "none")
  .attr("stroke-width", 1)
  .attr("d", this.line)
  .attr("stroke", "gray").style("stroke-dasharray", ("1, 1"));


}





   private createCharts(){
     this.width = 900 - this.margin.left - this.margin.right;
       this.height = 500 - this.margin.top - this.margin.bottom;

       const element = this.chartContainer.nativeElement;
       this.svg = d3.select(element).append('svg')
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
      this.x = d3Scale.scaleTime().range([0, this.width]);
      this.y = d3Scale.scaleLinear().range([this.height, 0]);
      this.x.domain(d3Array.extent(STOCKS, (d) => d.average ));
      this.y.domain(d3Array.extent(STOCKS, (d) => d.average ));

      this.svg.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3Axis.axisBottom(this.x));

      this.svg.append('g')
      .attr('class', 'axis axis--y')
      .call(d3Axis.axisLeft(this.y))
      .append('text')
      .attr('class', 'axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Price ($)');

      this.line = d3Shape.line()
      .defined(function(d) {
		          return d !== null;
	           })
         .x( (d: any) => this.x(d.date) )
         .y( (d: any) => this.y(d.value) );

     this.svg.append('path')
         .datum(STOCKS)
         .attr('class', 'line')
         .attr('d', this.line)
         .attr('stroke','blue');
   }





}
