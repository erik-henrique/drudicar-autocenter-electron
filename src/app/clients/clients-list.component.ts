import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.scss']
})
export class ClientsListComponent implements OnInit {
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
