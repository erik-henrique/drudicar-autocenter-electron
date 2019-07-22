import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  public clients = [{
    name: 'Erik'
  }, {
    name: 'Renan'
  }, {
    name: 'Erik'
  }, {
    name: 'Renan'
  }, {
    name: 'Erik'
  }, {
    name: 'Renan'
  }, {
    name: 'Erik'
  }, {
    name: 'Renan'
  }, {
    name: 'Erik'
  }, {
    name: 'Renan'
  }, {
    name: 'Erik'
  }, {
    name: 'Renan'
  }, {
    name: 'Erik'
  }, {
    name: 'Renan'
  }, {
    name: 'Erik'
  }, {
    name: 'Renan'
  }, {
    name: 'Erik'
  }, {
      name: 'Renan'
  }, {
    name: 'Erik'
  }, {
    name: 'Renan'
  }];

  constructor() { }

  ngOnInit() {
  }

  public goToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
