import { Injectable } from '@angular/core';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { DataAcessSettings } from './repositories/settings';
import { ClientEntity } from './entities/client.entity';
import { VehicleEntity } from './entities/vehicle.entity';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    public connection: Promise<Connection>;
    private readonly options: ConnectionOptions;

    constructor() {
        DataAcessSettings.initialize();
        this.options = {
            type: 'sqlite',
            database: DataAcessSettings.dbPath,
            entities: [ClientEntity, VehicleEntity],
            synchronize: true,
            logging: 'all',
        };
        console.log('DataAcessSettings')
        this.connection = createConnection(this.options);
    }
}
