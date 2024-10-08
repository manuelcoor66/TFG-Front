import { Deserialize, IJsonObject } from 'dcerialize';
import { Observable, catchError, map } from 'rxjs';
import { Place, PlaceList } from '../models/places';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  /**
   * API path
   */
  path!: string;

  constructor(protected http: HttpClient) {
    this.path = 'http://127.0.0.1:5000/places';
  }

  getAllPlaces(): Observable<PlaceList> {
    return this.http.get<IJsonObject>(`${this.path}/all-places`).pipe(
      map((places) => Deserialize(places, () => PlaceList)),
      catchError((err) => {
        throw err;
      }),
    );
  }

  getPlaceByName(name: string): Observable<Place> {
    return this.http.get<IJsonObject>(`${this.path}/${name}`).pipe(
      map((place) => Deserialize(place, () => Place)),
      catchError((err) => {
        throw err;
      }),
    );
  }
}
