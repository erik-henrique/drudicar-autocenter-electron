import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { catchError } from 'rxjs/operators';
import IZipCode from '../../interfaces/zipCode.interface';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) {}

  private formatErrors(error: any) {
    return throwError(error.error);
  }

  public get(url: string, returnType: string, id?: string) {
    return this.http
      .get(`${url}/${id ? `${id}/` : ''}${returnType}`)
      .pipe(catchError(this.formatErrors));
  }
}
