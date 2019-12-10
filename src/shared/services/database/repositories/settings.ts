import * as path from 'path';
import { remote } from 'electron';
import { environment } from '../../../../environments/environment';

export class DataAcessSettings {
  public static dbFolder: string;
  public static dbPath: string;
  public static appPath: string;
  private static dataSubFolder: string;
  private static dbName = 'database.db';

  public static initialize(): void {
    DataAcessSettings.getPaths();
  }

  private static getPaths() {
    if (environment.production) {
      this.dataSubFolder = '/';
      DataAcessSettings.appPath = remote.app.getPath('userData');
    } else {
      // return folder where app is running
      this.dataSubFolder = 'dist/assets/data';
      DataAcessSettings.appPath = remote.app.getAppPath();
    }

    DataAcessSettings.dbFolder = path.join(
      DataAcessSettings.appPath,
      DataAcessSettings.dataSubFolder
    );
    DataAcessSettings.dbPath = path.join(
      DataAcessSettings.dbFolder,
      this.dbName
    );
  }
}
