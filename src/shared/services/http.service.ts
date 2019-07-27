import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { catchError } from 'rxjs/operators';
import IZipCode from '../interfaces/zipCode.interface';

@Injectable()
export class HttpService {
    constructor(
        private http: HttpClient
    ) { }

    private formatErrors(error: any) {
        return throwError(error.error);
    }

    public getZipCode(zipCode: string): Observable<IZipCode> {
        return this.http.get<IZipCode>(`https://viacep.com.br/ws/${zipCode}/json`).pipe(catchError(this.formatErrors));
    }
}
