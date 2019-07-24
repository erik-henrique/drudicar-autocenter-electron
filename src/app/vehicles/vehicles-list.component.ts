import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VehicleAddEditComponent } from './add-edit/vehicle-add-edit.component';

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
  {
    modelo: 'FIAT/UNO MILLE EP', marca: 'FIAT/UNO MILLE EP', cor: 'Azul', ano: 2012, anoModelo: 2011,
    placa: 'FZC-6504', uf: 'SP', municipio: 'Americana', chassi: '99092'
  },
  {
    modelo: 'FIAT/UNO MILLE EP', marca: 'FIAT/UNO MILLE EP', cor: 'Preto', ano: 2014, anoModelo: 2013,
    placa: 'FZC-9504', uf: 'SP', municipio: 'Campinas', chassi: '99092'
  },
  {
    modelo: 'FIAT/UNO MILLE EP', marca: 'FIAT/UNO MILLE EP', cor: 'Branco', ano: 2011, anoModelo: 2011,
    placa: 'FZC-6804', uf: 'SP', municipio: 'Sumaré', chassi: '99092'
  },
  {
    modelo: 'FIAT/UNO MILLE EP', marca: 'FIAT/UNO MILLE EP', cor: 'Cinza', ano: 2017, anoModelo: 2017,
    placa: 'FZC-6594', uf: 'SP', municipio: 'Hortolândia', chassi: '99092'
  }
];

@Component({
  selector: 'app-vehicles-list',
  templateUrl: './vehicles-list.component.html',
  styleUrls: ['./vehicles-list.component.scss']
})
export class VehiclesListComponent implements OnInit {
  displayedColumns: string[] = ['modelo', 'marca', 'cor', 'ano', 'anoModelo', 'placa', 'uf', 'municipio', 'chassi', 'edit', 'delete'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(VehicleAddEditComponent, {
      minWidth: '75%',
      minHeight: '75%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
