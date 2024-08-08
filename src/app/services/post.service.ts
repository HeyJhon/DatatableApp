import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PostModel } from '../models/postmodel.interface';

@Injectable({
  providedIn: 'root'
})
export class PostService {
private urlBase = "https://jsonplaceholder.typicode.com";

  constructor(private _http: HttpClient) { }

  getAllPost(){
    return this._http.get<PostModel[]>(this.urlBase + '/posts');
  }
}
