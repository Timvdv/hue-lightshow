import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  constructor() { }

  mp3: string;

  ngOnInit() {
    this.mp3 = "../assets/audio/cheerleader.mp3";
  }

  showTimeline(event) {
    this.mp3 = event;
  }
}
