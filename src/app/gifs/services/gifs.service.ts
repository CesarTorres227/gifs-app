import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private apiKey: string = 'iXVu2ROWq5TFujjJiXVP3thMdUUTISZb';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  constructor( private http: HttpClient) {
    this.loadLocalStorage();
   }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string) {
    //El string se pasa a minuscula
    tag = tag.toLowerCase();
    //Si el tagsHistory incluye el tag nuevo se elimina
    if( this._tagsHistory.includes( tag )){
      this._tagsHistory = this._tagsHistory.filter( (oldTag) => oldTag !== tag)
    }
    //Se inserta el nuevo tag
    this._tagsHistory.unshift( tag );
    //Limitar los tags a 10
    this._tagsHistory = this.tagsHistory.splice(0,10);
    //Almacnar en localstorage los tags
    this.saveLocalStorag();
  }

  private saveLocalStorag(): void {
    localStorage.setItem('history', JSON.stringify( this._tagsHistory ));
  }

  private loadLocalStorage(): void {

    if(!localStorage.getItem('history')) return;

    this._tagsHistory = JSON.parse( localStorage.getItem('history')! );

    if( this._tagsHistory.length === 0 ) return;
    this.searchTag( this._tagsHistory[0] );

  }

  async searchTag( tag: string ):Promise<void> {
    if( tag.length === 0) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', tag)

    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, { params })
      .subscribe( resp => {
        this.gifList = resp.data;
      })
  }

}
