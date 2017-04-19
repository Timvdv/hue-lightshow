import { Component, AfterViewInit, OnDestroy, Inject, ViewChild, ElementRef, NgZone, Input } from '@angular/core';
import TimelineState from './timeline-state';
import { HueService } from '../hue.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements AfterViewInit, OnDestroy {
    wavesurfer: any;
    window: any;
    state: TimelineState = TimelineState.PAUSE;
    TimelineState = TimelineState;
    timelineCounter: number = 0;
    color: string = "#1abc9c";
    playColor: string = "#1abc9c";
    cardState: boolean = true;

    @Input() mp3: string;

    timeline: any = {
        duration: null,
        width: null,
        circle_offset: 0
    }

    dots: any[] = [];
    previousRegion: number = null;

    @ViewChild('waveform') elementRef: ElementRef;

    constructor(
        @Inject('Window') window: any,
        public zone: NgZone,
        private hueService: HueService
    ) {
        this.window = window;
    }

    ngAfterViewInit() {
        this.wavesurfer = this.window.WaveSurfer.create({
            container: this.elementRef.nativeElement,
            waveColor: this.color,
            barWidth: 2,
            progressColor: "#43f3d0",
            normalize: true
        });

        this.wavesurfer.load(this.mp3);

        this.wavesurfer.on('ready', () => {

            this.timeline.duration = this.wavesurfer.getDuration();
            this.timeline.width = this.elementRef.nativeElement.clientWidth;

            let l = Math.round(this.wavesurfer.getDuration());

            for (var i = 0; i < l; i = i + 1) {
                let j = i + 1;

                let previousRegion = this.previousRegion ? this.previousRegion : j;

                this.generateLightshow( i, j );
            }
        });

        this.wavesurfer.on('audioprocess', (current_time) => {
            this.updateOffsetByTime(current_time);
        });

        this.wavesurfer.on('seek', (current_percentage) => {
            current_percentage = this.timeline.width * current_percentage;
            this.updateOffsetByPercentage(current_percentage);
        });

        this.wavesurfer.on('region-in', (region: any) => {
            this.hueService.setColor(region.color);
            this.playColor = region.color.slice(0, region.color.length - 3) + "1)";
        });
    }

    generateLightshow(from, to) {

        // Gaat nog iets mis met previousRegion
        //console.log(from, to);

        var nominalWidth = Math.round(
            this.wavesurfer.getDuration() * this.wavesurfer.params.minPxPerSec * this.wavesurfer.params.pixelRatio
        );

        let p = this.wavesurfer.backend.getPeaks(nominalWidth, from, to);

        this.previousRegion = to;

        for (var i = p.length - 1; i >= 0; i--) {
            let val = Math.round(p[i] * 100);

            if( val > 10 ) {

                let region_color = 'hsla('+ (360/val*10) +', 50%, 45%, .3)';

                // Needed to remove doubles
                if(this.wavesurfer.regions && this.wavesurfer.regions.list) {
                    let added_region = this.wavesurfer.regions.list;

                    for ( var i=0, len=added_region.length; i < len; i++ ) {
                        if( added_region[i]['start'] == from || added_region[i]['color'] == region_color ) {
                            console.log(added_region[i]['color']);
                            return;
                        }
                    }
                }

                // Add the region to wavesurfer
                let region = this.wavesurfer.addRegion({
                    start: from,
                    end: to,
                    color: region_color,
                    resize: false,
                    drag: false,
                });

                this.previousRegion = null;

                //NOT SURE WHAT HAPPENS BUT SHIT GETS RLLY SLOW WHEN UNCOMMENT
                // let dot = {
                //     circle_offset: region.wrapper.offsetLeft,
                //     color: region.color,
                //     time: region.start,
                //     end: region.end
                // }

                // this.newEffect(dot)
            }
        }
    }

    ngOnDestroy() {
        this.wavesurfer.unAll();
        this.wavesurfer.stop();
    }

    removeDot(event) {
        let i = 0;
        var parent = event.target.parentNode;
        var index = Array.prototype.indexOf.call(parent.children, event.target);

        this.dots.splice(index, 1);

        this.calculatePoints();
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

    newEffect(addObject) {
        let dot = {
            circle_offset: this.timeline.circle_offset,
            color: this.color,
            time: this.wavesurfer.getCurrentTime(),
            end: this.wavesurfer.getCurrentTime() + 3
        }

        if(addObject) {
            dot = addObject;
        }

        this.dots.push(dot);

        this.calculatePoints();
    }

    calculatePoints() {
        this.wavesurfer.clearRegions();

        //let sorted_dots = this.sortDots();
        let sorted_dots = this.dots;

        for (var i = 0; i < sorted_dots.length; i++) {
            let current_dot = sorted_dots[i];

            this.wavesurfer.addRegion({
                start: current_dot.time,
                end: sorted_dots[i].end,
                color: current_dot.color,
                resize: true,
                drag: true,
            });
        }
    }

    sortDots() {
        let sort = ( (el, next) => {
            let el_start = Math.round(el.circle_offset);
            let next_start = Math.round(next.circle_offset);

            if (el_start < next_start)
                return -1;
            if (el_start > next_start)
                return 1;

            return 0;
        });

        return this.dots.sort(sort);
    }

    openCard(event) {
        if(event.target.classList && event.target.classList[0] === "color-circle") {
            this.cardState = true;
        }
    }

    closeCard() {
        this.cardState = false;
    }

}