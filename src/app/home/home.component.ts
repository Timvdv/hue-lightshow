import { Component, OnInit, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';

import { HueService } from '../hue.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(
      private router: Router,
      private hueService: HueService
      ) { }

    ngOnInit() {

    }

    connectToBridge() {
        this.hueService.getLights().then(lala => {
            console.log(lala)
        });

        this.router.navigate(['/lightshow']);

        let body = {"devicetype": "my_hue_app#iphone peter"};
    }
}
