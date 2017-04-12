import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    svgLightshow: any[] = [
        {
            color: "#1abc9c",
            offset_left: -400,
            offset_top: 40,
            animation: 'lightshow5',
            duration: 4
        },
        {
            color: "#3498db",
            offset_left: -100,
            offset_top: -20,
            animation: 'lightshow4',
            duration: 4
        },
        {
            color: "#8e44ad",
            offset_left: 200,
            offset_top: 20,
            animation: 'lightshow3',
            duration: 5
        },
        {
            color: "#e67e22",
            offset_left: 500,
            offset_top: 10,
            animation: 'lightshow2',
            duration: 10
        },
        {
            color: "#f1c40f",
            offset_left: 600,
            offset_top: -60,
            animation: 'lightshow1',
            duration: 8
        },
        {
            color: "#e74c3c",
            offset_left: 900,
            offset_top: 10,
            animation: 'lightshow',
            duration: 5
        }
    ]

    constructor(
        private route:ActivatedRoute
    ) {
        //Remove animation when on lightshow page
        if(route.snapshot.url.join('') === "lightshow") {
            console.log('ja')
            for (let i = this.svgLightshow.length - 1; i >= 0; i--) {
                this.svgLightshow[i].animation = "niet";
            }
        }
    }

    ngOnInit() {
    }

}
