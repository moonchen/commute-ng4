import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import * as moment from 'moment';
import { ETAApi, RouteApi, Route } from '../../api/index';

@Component({
    selector: 'app-eta',
    templateUrl: './eta.component.html',
    styleUrls: ['./eta.component.scss']
})

export class ETAComponent implements OnInit, AfterViewInit {
    @ViewChild('etaCanvas') canvas: ElementRef;

    private beginDate = moment().hour(14).minute(0).second(0);
    private endDate = moment().hour(20).minute(0).second(0);
    private lastPoint = this.beginDate.clone(); // The most recent fetched point
    private route = 0;
    public etaChartData: any = [{ data: {x: moment(), y: 600}, label: 'Travel time' }];
    public currentDuration: moment.Duration = moment.duration();
    public routeInfo: Route;
    public routeLink: string;
    private gradient: any;
    public etaChartColors = [{}];
    public etaChartOptions = {
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                type: 'time',
                position: 'bottom',
                time: {
                    min: this.beginDate,
                    max: this.endDate,
                    round: 'minute',
                    displayFormats: {
                        minute: 'h:mm a',
                        hour: 'hA'
                    }
                },
                gridLines: {
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: false
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Travel time (seconds)'
                }
            }]
        },
        tooltips: {
            callbacks: {
                title: (tti: Array<any>, data) => {
                    if (tti && tti.length > 0) {
                        const index = tti[0].index;
                        const ts = this.etaChartData[0].data[index].x;
                        return ts.format('h:mm a');
                    }
                    return '';
                },
                label: function (tti, data) {
                    return moment.duration(tti.yLabel, 'seconds').humanize();
                }
            }
        },
        legend: {
            display: false
        },
        hover: {
            mode: 'x',
            intersect: false
        }
    };
    public loading = true;
    public loadingHeader = true;
    public loadingGraph = true;
    public loadingProgress = 0;

    constructor(private etaAPI: ETAApi, private routeAPI: RouteApi) { }

    updateChartData(data) {
        const newPoints: Array<{ x: moment.Moment, y: number }> = [];
        const len = data.timestamps.length;

        console.info('updateChartData: got ' + len + ' items.');

        for (let i = 0; i < len; i++) {
            const x = moment(data.timestamps[i] * 1000);
            const y = data.seconds[i];
            const point = { x: x, y: y };
            newPoints.push(point);

            if (x > this.lastPoint) {
                this.lastPoint = x.clone();
                this.lastPoint.add(1, 'second');
                this.currentDuration = moment.duration(y, 'seconds');
            }
        }

        // Hacky: ng2-charts doesn't have ngDoCheck for data, so we replace it with a new data
        const newData = [{ data: [], label: 'Travel time' }];
        if (this.etaChartData[0].data) {
            newData[0].data = this.etaChartData[0].data.concat(newPoints);
        } else {
            newData[0].data = newPoints;
        }
        this.etaChartData = newData;
        this.loadingGraph = false;
        this.loading = this.loadingGraph || this.loadingHeader;
    }

    requestData() {
        console.info('Requesting from ' + this.lastPoint.unix() + ' to ' + this.endDate.unix());
        return this.etaAPI.getEta(this.route, this.lastPoint.unix(), this.endDate.unix());
    }

    ngOnInit() {
        // Initialize data color
        this.gradient = this.canvas.nativeElement.getContext('2d').createLinearGradient(0, 0, 0, 280);
        this.gradient.addColorStop(0, 'rgba(0, 86, 145, 1)');
        this.gradient.addColorStop(1, 'rgba(0, 86, 145, 0)');
        const etaChartColors = [{
            pointRadius: 0,
            lineTension: 0,
            backgroundColor: this.gradient,
            borderColor: 'rgba(0, 86, 145, 1)',
            borderWidth: 1
        }];
        this.etaChartColors = etaChartColors;
    }

    ngAfterViewInit() {
        // Remove the dummy data in the chart
        this.etaChartData[0].data = [];

        // Get duration
        this.routeAPI.getRoute(this.route).subscribe(
            (routeInfo: Route) => {
                this.routeInfo = routeInfo;
                this.routeLink = 'https://www.google.com/maps/dir/?api=1&origin=' + 
                    encodeURIComponent(routeInfo.from.address) +
                    '&destination=' + encodeURIComponent(routeInfo.to.address);
                this.loadingHeader = false;
                this.loading = this.loadingHeader || this.loadingGraph;
            }
        );

        const chartUpdateProc = () =>
            this.requestData().subscribe(
                (etas) => this.updateChartData(etas)
            );

        // Update chart once, then once per minute
        chartUpdateProc();
        setInterval(chartUpdateProc, 6000);
    }

}
