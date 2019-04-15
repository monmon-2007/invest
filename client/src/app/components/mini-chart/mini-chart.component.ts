import { Component, OnInit,Input, OnChanges, ViewChild, ElementRef, ViewEncapsulation  } from '@angular/core';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';


@Component({
  selector: 'app-mini-chart',
  templateUrl: './mini-chart.component.html',
  styleUrls: ['./mini-chart.component.css']
})
export class MiniChartComponent implements OnInit {
  title = 'Line Chart';
  @Input('customTitle') customTitle: Array<any>;
  @Input('customTitle2') customTitle2;
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
    this.initSvg();
    this.initAxis();
    this.drawLine();
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

    var temp ={"date":null,"average":null}
    var i;
    for(i =0; i<this.customTitle.length;i++){
       this.baseLine.push({"date":this.customTitle[i].date,"average":this.customTitle2})
        if(this.customTitle[i].average>=this.customTitle2){
          this.green.push(this.customTitle[i])
          this.red.push(temp)

          if(i>0 && i<this.customTitle.length-1){
            if(this.customTitle[i-1].average<this.customTitle2){
              this.red[i-1]={"date":this.customTitle[i-1].date,"average":this.customTitle2}
              this.green[i-1]={"date":this.customTitle[i-1].date,"average":this.customTitle2}
            }
            if(this.customTitle[i+1].average<this.customTitle2){
              this.red[i]={"date":this.customTitle[i].date,"average":this.customTitle2}
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

}
