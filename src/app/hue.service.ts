import { Injectable, Inject } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class HueService {
    window: any;

    bridge_ip: string = "http://10.0.1.2/";
    //bridge_ip: string = "http://145.24.218.128:8080/";
    //bridge_ip: string = "http://192.168.1.3/";

    username: string = "newdeveloper"
    //username: string = "UTZXYbUA3t6iCeXhjRV5mORC703q6UJToYw4M24o"

    api_url: string = this.bridge_ip + 'api/' + this.username + '/';

    constructor(
        @Inject('Window') window: any,
        private http: Http
    ) {
        this.window = window;
    }

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

        let cie = this.window.rgb_to_cie(color[0], color[1], color[2]);

        // let saturation = rgb[0];//(Math.round(rgb[1] * 254));
        // let hue = Math.round( rgb[0] * 100000 );
        // console.log(saturation, hue);

        let body = { "on":true, "xy":[Math.round(cie[0] * 100) / 100, Math.round(cie[1] * 100) / 100,] };

        return this.http
            .put(this.api_url + "groups/0/action", JSON.stringify(body))
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    colorLoop() {
        // {"effect":"colorloop"}
    }

    blink() {
        // {"alert":"select"}
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
