import { Component, AfterViewInit, Inject, ViewChild, ElementRef, NgZone } from '@angular/core';
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
    timelineCounter: number = 0;

    timeline: any = {
        duration: null,
        width: null,
        circle_offset: 0
    }

    @ViewChild('waveform') elementRef: ElementRef;

    constructor(
        @Inject('Window') window: any,
        public zone: NgZone
    ) {
        this.window = window;
    }

    ngAfterViewInit() {
        this.wavesurfer = this.window.WaveSurfer.create({
            container: this.elementRef.nativeElement,
            waveColor: '#1abc9c'
        });

        this.wavesurfer.load('../assets/audio/cheerleader.mp3');

        this.wavesurfer.on('ready', () => {
            this.timeline.duration = this.wavesurfer.getDuration();
            this.timeline.width = this.elementRef.nativeElement.clientWidth;
        });

        this.wavesurfer.on('audioprocess', (current_time) => {
            this.updateOffsetByTime(current_time);
        });

        this.wavesurfer.on('seek', (current_percentage) => {
            console.log('percentage: ', current_percentage);

            current_percentage = this.timeline.width * current_percentage;

            this.updateOffsetByPercentage(current_percentage);
        });
    }

    updateOffsetByPercentage(current_percentage) {
        this.zone.run(() => this.timeline.circle_offset = current_percentage);
    }

    updateOffsetByTime(current_time) {
        current_time = Math.round(current_time * 100) / 100;

        let offset = this.timeline.width / this.timeline.duration * current_time;
        this.zone.run(() => this.timeline.circle_offset = offset);
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
