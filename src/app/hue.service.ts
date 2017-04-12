import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class HueService {
    bridge_ip: string = "http://145.24.218.128:8080/";
    username: string = "newdeveloper"
    api_url: string = this.bridge_ip + 'api/' + this.username + '/';

    constructor(
        private http: Http
    ) {  }

    create(name: string): Promise<any> {
      let app_body
      return this.http
        .post(this.api_url, JSON.stringify({name: name}))
        .toPromise()
        .then(res => console.log(res.json()))
        .catch(this.handleError);
    }

    getLights(): Promise<any> {
      return this.http
        .get(this.api_url + "lights")
        .toPromise()
        .then(res => res.json())
        .catch(this.handleError);
    }

    setColor(color: any): Promise<any> {
        let body = {"on":true,"bri":240,"sat":200,"hue":0};

        return this.http
            .put(this.api_url + "groups/0", JSON.stringify(body))
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
