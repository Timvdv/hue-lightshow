import { Component, OnInit, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import LinkButtonState from './link-button.state';

import { HueService } from '../hue.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    state: LinkButtonState = LinkButtonState.NORMAL;
    LinkButtonState = LinkButtonState;
    countdown: number;

    constructor(
        private router: Router,
        private hueService: HueService
    ) { }

    bridge: any;
    username: string = null;

    ngOnInit() {
        this.countdown = 30;
    }

    connectToBridge() {
        this.state = LinkButtonState.LOADING;
        this.hueService.findBridge().then( (bridge) => {
            if(bridge && bridge.length) {
                this.bridge = bridge[0];
                this.state = LinkButtonState.WAITFORLINK;
                this.createUser();
            }
        });
    }

    createUser() {
        this.hueService.ceateUser(this.bridge.internalipaddress, {"devicetype": "hue lightshow#browser"}).then( (response) => {

            if(response && response.length) {
                response = response[0];
            }

            if(response.success) {
                this.state = LinkButtonState.SUCCESS;
                this.username = response.success.username;

                localStorage.setItem('username', this.username);
                localStorage.setItem('bridge_ip', this.bridge.internalipaddress);

                //Set userdata because localstorage is changed
                this.hueService.setUserData();

                setTimeout( () => {
                    this.router.navigate(['/lightshow']);
                }, 1000);

            } else if (response.error) {
                if(response.error.description === "link button not pressed") {
                    if(this.countdown == 0) {
                        this.state = LinkButtonState.FAILED;
                        return;
                    }

                    this.countdown--;

                    setTimeout( () => {

                        this.createUser();
                    }, 1000);
                }
            }
        });
    }
}
