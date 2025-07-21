import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { SERVER_URL } from '../../lib/constans';
import { Pet } from '../../lib/types';
import { GrpcPet, GrpcPets } from '../../generated/src/proto/K';
import { map } from 'rxjs/operators';

// import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PetsService {
  private apiUrl = SERVER_URL;
  constructor(private http: HttpClient) {}


  private headers = { 'Content-Type': 'application/x-protobuf', Accept: 'application/x-protobuf'};
  private encodePet(pet: GrpcPet): ArrayBuffer {
    return GrpcPet.encode(pet).finish().buffer;
  }

  // getPets(): Observable<Pet[]> {
  //   return this.http.get<Pet[]>(this.apiUrl + 'getPets').pipe(
  //     catchError((err) => {
  //       alert(err?.error?.message || 'Failed to fetch pets');
  //       return throwError(() => err);
  //     })
  //   );
  // }
  public getPets = (): Observable<GrpcPet[]> => {
    return this.http.get(`${this.apiUrl}getPets`, {
      responseType: 'arraybuffer',
      headers: this.headers,
    }).pipe(
      map((response: ArrayBuffer) => {
        return GrpcPets.decode(new Uint8Array(response)).grpcPet
      })
    );
  }

  // createPet(pet: Pet): Observable<Pet> {
  //   return this.http.post<Pet>(this.apiUrl + 'addPet', pet).pipe(
  //     catchError((err) => {
  //       alert(err?.error?.message || 'Failed to create pet');
  //       return throwError(() => err);
  //     })
  //   );
  // }

  
  createPet(pet: GrpcPet): Observable<ArrayBuffer> {
    const petBuffer = this.encodePet(pet);
    return this.http.post(`${this.apiUrl}addPet`, petBuffer, {
      responseType: 'arraybuffer',
      headers: this.headers
    });
  }
 
  // createPet = (pet : GrpcPet) => {
  //   const petBuffer = GrpcPet.encode(pet).finish().buffer;
  //   return this.http.post(`${this.apiUrl}/proto/addPet`, petBuffer,  {responseType: 'arraybuffer', headers: this.headers})
  // } 

  updatePet(id: number, pet: Pet): Observable<Pet> {
    return this.http.put<Pet>(`${this.apiUrl}updatePet/${id}`, pet).pipe(
      catchError((err) => {
        alert(err?.error?.message || 'Failed to update pet');
        return throwError(() => err);
      })
    );
  }

  deletePet(id?: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}deletePet/${id}`).pipe(
      catchError((err) => {
        alert(err?.error?.message || 'Failed to delete pet');
        return throwError(() => err);
      })
    );
  }
}