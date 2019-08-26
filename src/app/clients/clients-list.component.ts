import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../shared/services/data-access/database.service';
import { ClientEntity } from '../../shared/services/data-access/entities/client.entity';
import IClient from 'src/shared/interfaces/client.interface';
import { MatDialog } from '@angular/material';
import { ConfirmationComponent } from '../../shared/components/confirmation/confirmation.component';

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.scss']
})
export class ClientsListComponent implements OnInit {
  public clients: IClient[];

  constructor(private _databaseService: DatabaseService, private dialog: MatDialog) { }

  async ngOnInit() {
    await this.getClients();
  }

  async getClients() {
    await this._databaseService
      .connection
      .then(async () => {
        const clients = await ClientEntity.find();
        this.clients = clients as IClient[];
      });
  }

  public goToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  async deleteClient(client: IClient) {
    const confirmation = {
      message: `Tem certeza que deseja desativar o cliente ${client.nome.charAt(0).toUpperCase() + client.nome.slice(1)} ?`,
      confirmed: false
    };

    const dialogRef = this.dialog.open(ConfirmationComponent, {
      minWidth: '25%',
      minHeight: '25%',
      data: { ...confirmation }
    });

    dialogRef.afterClosed().subscribe(async (data) => {
      if (data) {
        await this._databaseService
          .connection
          .then(async () => {
            await ClientEntity.update({ id: client.id }, { status: false });
            await this.getClients();
          });
      }
    });
  }
}
