import { Injectable, Inject } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { api_url } from '../env';

@Injectable()
export class HueService {
    window: any;
    effect: string = null;
    alert: string = null;
    previousCall: any = null;
    apiUrl: string = null;

    constructor(
        @Inject('Window') window: any,
        private http: Http
    ) {
        this.window = window;

        // IF debugging, use env file bridge
        // this.apiUrl = api_url;
        this.setUserDataInit();
    }

    // TMP: blugh
    setUserDataInit() {
        let username = localStorage.getItem('username');
        let bridge = localStorage.getItem('bridge_ip');

        if(username && bridge) {
            this.apiUrl = "http://" + bridge + "/api/" + username + "/"
        } else {
            // alert('Cannot set userdata, something went wrong');
        }
    }

    setUserData() {
        let username = localStorage.getItem('username');
        let bridge = localStorage.getItem('bridge_ip');

        if(username && bridge) {
            this.apiUrl = "http://" + bridge + "/api/" + username + "/"
        } else {
            alert('Cannot set userdata, something went wrong');
        }
    }

    create(name: string): Promise<any> {
      let app_body
      return this.http
        .post(this.apiUrl, JSON.stringify({name: name}))
        .toPromise()
        .then(res => console.log(res.json()))
        .catch(this.handleError);
    }

    getLights(): Promise<any> {
      return this.http
        .get(this.apiUrl + "lights")
        .toPromise()
        .then(res => res.json())
        .catch(this.handleError);
    }

    hslToRgbString(color) {
        // Parse first HSLA value to int
        let h = Math.round(parseInt(color.split("(")[1].split(',')[0]));
        let s = color.split(',')[1];
        let l = color.split(',')[2];

        // Regions come in HSL color
        return this.window.colorcolor("hsl("+ h + "," + s + "," + l + ")", "rgba");
    }

    setColor(color: any, lightId: number): Promise<any> {

        let hsl_to_rgb = this.hslToRgbString(color);
        let rgb_array = hsl_to_rgb.slice(5, hsl_to_rgb.length).split(',');

        // Convert HSL into something Philips Hue understands
        let cie = this.window.rgb_to_cie(rgb_array[0], rgb_array[1], rgb_array[2]);

        if(cie && (cie[0] === 0 || this.previousCall === cie)) {
            return;
        }

        this.previousCall = cie;

        let body: any = {
            "on":true,
            "xy":[Math.round(cie[0] * 100) / 100, Math.round(cie[1] * 100) / 100,],
            "transitiontime": 0
        };

        if( this.effect ) {
            //body.effect = this.effect;
        }

        if( this.alert ) {
            body.alert = this.alert;
        }

        return this.http
            //.put(this.apiUrl + "groups/0/action", JSON.stringify(body)) // Group state is slower
            .put(this.apiUrl + "lights/"+ lightId +"/state", JSON.stringify(body))
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    colorLoop() {
        this.alert = "none";
        this.effect = "colorloop";
    }

    blink() {
        this.effect = null;
        this.alert = "lselect";
    }

    noEffect() {
        this.effect = null;
        this.alert = "none";
    }

    findBridge(): Promise<any> {
        return this.http
            .get("https://www.meethue.com/api/nupnp")
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    ceateUser(bridge_ip, user) {
        return this.http
            .post("http://" + bridge_ip + "/api", JSON.stringify(user))
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
