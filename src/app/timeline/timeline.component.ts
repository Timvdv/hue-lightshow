import { Component, AfterViewInit, Inject, ViewChild, ElementRef } from '@angular/core';
import TimelineState from './timeline-state';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements AfterViewInit {
    wavesurfer: any;
    window: any;
    state: TimelineState = TimelineState.PAUSE;
    TimelineState = TimelineState;

    @ViewChild('waveform') elementRef: ElementRef;

    constructor(
        @Inject('Window') window: any
    ) {
        this.window = window;
    }

    ngAfterViewInit() {
        this.wavesurfer = this.window.WaveSurfer.create({
            container: this.elementRef.nativeElement,
            waveColor: '#1abc9c'
        });

        this.wavesurfer.load('http://ia902606.us.archive.org/35/items/shortpoetry_047_librivox/song_cjrg_teasdale_64kb.mp3');

        this.wavesurfer.on('ready', () => {
            console.log('wavesurfer()');
        });
    }

    play() {
        this.state = TimelineState.PLAY;
        this.wavesurfer.play();
    }

    pause() {
        this.state = TimelineState.PAUSE;
        this.wavesurfer.pause();
    }

}
