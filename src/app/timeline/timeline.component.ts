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
    color: string = "#1abc9c";
    cardState: boolean = true;

    timeline: any = {
        duration: null,
        width: null,
        circle_offset: 0
    }

    dots: any[] = [];

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
            waveColor: this.color,
            progressColor: "#43f3d0"
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

    newEffect() {
        this.dots.push({
            circle_offset: this.timeline.circle_offset,
            color: this.color,
            time: this.wavesurfer.getCurrentTime()
        });

        this.calculatePoints();
    }

    calculatePoints() {
        this.wavesurfer.clearRegions();

        this.dots.filter( (el) => {
            return el.end > el.start
        });

        for (var i = 0; i < this.dots.length; i++) {
            let current_dot = this.dots[i];
            let next_dot = this.dots[i + 1];

            let color: string = this.convertHex(this.dots[i].color, 30 );

            let end_time = next_dot ? next_dot.time : this.wavesurfer.getDuration();

            this.wavesurfer.addRegion({
                start: current_dot.time,
                end: end_time,
                color: color,
                resize: false,
                drag: false,
            });
        }


    }

    openCard(event) {
        if(event.target.classList && event.target.classList[0] === "color-circle") {
            this.cardState = true;
        }
    }

    closeCard() {
        this.cardState = false;
    }

    convertHex(hex,opacity): string {
        hex = hex.replace('#','');
        let r = parseInt(hex.substring(0,2), 16);
        let g = parseInt(hex.substring(2,4), 16);
        let b = parseInt(hex.substring(4,6), 16);
        let result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
        return result;
    }

}
