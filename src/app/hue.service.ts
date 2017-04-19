import { Injectable, Inject } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { api_url } from '../env';

@Injectable()
export class HueService {
    window: any;
    effect: string = null;
    alert: string = null;

    constructor(
        @Inject('Window') window: any,
        private http: Http
    ) {
        this.window = window;
    }

    create(name: string): Promise<any> {
      let app_body
      return this.http
        .post(api_url, JSON.stringify({name: name}))
        .toPromise()
        .then(res => console.log(res.json()))
        .catch(this.handleError);
    }

    getLights(): Promise<any> {
      return this.http
        .get(api_url + "lights")
        .toPromise()
        .then(res => res.json())
        .catch(this.handleError);
    }

    previousCall: any = null;

    setColor(color: any): Promise<any> {
        // Parse first HSLA value to int
        let h = Math.round(parseInt(color.split("(")[1].split(',')[0]));
        let s = color.split(',')[1];
        let l = color.split(',')[2];

        // Regions come in HSL color
        let hsl_to_rgb = this.window.colorcolor("hsl("+ h + "," + s + "," + l + ")", "rgba");

        let rgb_array = hsl_to_rgb.slice(5, hsl_to_rgb.length).split(',');

        // Convert HSL into something Philips Hue understands
        let cie = this.window.rgb_to_cie(rgb_array[0], rgb_array[1], rgb_array[2]);

        if(cie && (cie[0] === 0 || this.previousCall == cie)) {
            return;
        }

        this.previousCall = cie;

        let body: any = {
            "on":true,
            "xy":[Math.round(cie[0] * 100) / 100, Math.round(cie[1] * 100) / 100,],
            "transitiontime": 0
        };

        if( this.effect ) {
            body.effect = this.effect;
        }

        if( this.alert ) {
            body.alert = this.alert;
        }

        return this.http
            //.put(this.api_url + "groups/0/action", JSON.stringify(body))
            .put(api_url + "lights/7/state", JSON.stringify(body))
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    colorLoop() {
        this.alert = null;
        this.effect = "colorloop";
    }

    blink() {
        this.effect = null;
        this.alert = "select";
    }

    noEffect() {
        this.effect = null;
        this.alert = null;
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
