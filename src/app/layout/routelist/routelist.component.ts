import { Component, OnInit } from '@angular/core';
import { RouteApi, Route } from '../../api/index';
import { Observable } from 'rxjs/Observable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-routes',
  templateUrl: './routelist.component.html',
  styleUrls: ['./routelist.component.scss']
})

export class RouteListComponent implements OnInit {
  public routesObservable: Observable<[Route]>;

  constructor(private routeAPI: RouteApi, private modalService: NgbModal) { }

  ngOnInit() {
    this.routesObservable = this.routeAPI.getRoutes();
  }

  onDelete(content) {
    this.modalService.open(content);
  }
}
