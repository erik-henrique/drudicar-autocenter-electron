import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  marca: string;
  modelo: string;
  cor: string;
  ano: number;
  anoModelo: number;
  placa: string;
  uf: string;
  municipio: string;
  chassi: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { modelo: 'FIAT/UNO MILLE EP', marca: 'FIAT/UNO MILLE EP', cor: 'Azul', ano: 2012, anoModelo: 2011,
  placa: 'FZC-6504', uf: 'SP', municipio: 'Americana', chassi: '99092' },
  { modelo: 'FIAT/UNO MILLE EP', marca: 'FIAT/UNO MILLE EP', cor: 'Preto', ano: 2014, anoModelo: 2013,
  placa: 'FZC-9504', uf: 'SP', municipio: 'Campinas', chassi: '99092' },
  { modelo: 'FIAT/UNO MILLE EP', marca: 'FIAT/UNO MILLE EP', cor: 'Branco', ano: 2011, anoModelo: 2011,
  placa: 'FZC-6804', uf: 'SP', municipio: 'Sumaré', chassi: '99092' },
  { modelo: 'FIAT/UNO MILLE EP', marca: 'FIAT/UNO MILLE EP', cor: 'Cinza', ano: 2017, anoModelo: 2017,
  placa: 'FZC-6594', uf: 'SP', municipio: 'Hortolândia', chassi: '99092' }
];

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {
  displayedColumns: string[] = ['modelo', 'marca', 'cor', 'ano', 'anoModelo', 'placa', 'uf', 'municipio', 'chassi', 'edit'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor() { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }
}
