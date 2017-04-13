import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

@Injectable()
export class JamendoService {
    //base_path = "https://api.jamendo.com/v3.0/artists/tracks/?client_id=709fa152&format=jsonpretty&order=track_name_desc&name=we+are+fm&album_datebetween=0000-00-00_2012-01-01";
    client_id = "0e4a1e80";
    feed_path = "https://api.jamendo.com/v3.0/feeds?client_id="+this.client_id;
    track_path = "https://api.jamendo.com/v3.0/tracks?client_id="+this.client_id;

  constructor(
      private http: Http
  ) {
      this.getSongs();
  }

    getSongs() {
        let headers: Headers = new Headers();

        return this.http
            .get(this.feed_path)
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    getMp3Url(id) {
        let headers: Headers = new Headers();

        return this.http
            .get(this.track_path + "&id="+id)
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    getTracks(fuzzyTag) {
        let headers: Headers = new Headers();

        return this.http
            .get(this.track_path + "&fuzzytags="+fuzzyTag)
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }


    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

}
