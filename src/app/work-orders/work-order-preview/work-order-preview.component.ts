import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-work-order-preview',
  templateUrl: './work-order-preview.component.html',
  styleUrls: ['./work-order-preview.component.scss']
})
export class WorkOrderPreviewComponent implements OnInit {
  servicos = [
    {
      nome: 'Troca de óleo',
      preco: 20,
    },
    {
      nome: 'Troca de motor',
      preco: 200,
    },
    {
      nome: 'Troca de pneu',
      preco: 40,
    }
  ];

  produtos = [
    {
      nome: 'Yamalube',
      preco: 20,
    },
    {
      nome: 'Porca aleatória',
      preco: 3,
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
