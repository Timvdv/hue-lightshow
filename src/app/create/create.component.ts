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
  }

  showTimeline(event) {
      this.mp3 = event;
  }
}
