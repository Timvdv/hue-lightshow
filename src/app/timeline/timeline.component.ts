import { Component, AfterViewInit, OnDestroy, Inject, ViewChild, ElementRef, NgZone, Input } from '@angular/core';
import TimelineState from './timeline-state';
import { HueService } from '../hue.service';

interface Region {
    start: number,
    end: number,
    color: string,
    resize: boolean,
    drag: boolean,
    data: any
}

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

    regionState: boolean = false;
    cardState: boolean = true;
    color: string = "#1abc9c";
    playColor: string = "#1abc9c";
    lights: any = [];
    effects: string[] = ['alarm', 'colorloop', 'noeffect'];
    effect: string = "noeffect";

    @Input() mp3: string;

    timeline: any = {
        duration: null,
        width: null,
        circle_offset: 0
    }

    region: Region = {
        start: null,
        end: null,
        color: this.color,
        resize: true,
        drag: true,
        data: {
            effect: this.effects[0],
            colors: []
        }
    }

    dots: any[] = [];
    previousRegion: number = 0;

    @ViewChild('waveform') elementRef: ElementRef;

    constructor(
        @Inject('Window') window: any,
        public zone: NgZone,
        private hueService: HueService
    ) {
        this.window = window;
    }

    ngAfterViewInit() {
        this.getDefaultLights();

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

            this.generateLightshow();
        });

        this.wavesurfer.on('audioprocess', (current_time) => {
            this.updateOffsetByTime(current_time);
        });

        this.wavesurfer.on('seek', (current_percentage) => {
            current_percentage = this.timeline.width * current_percentage;
            this.updateOffsetByPercentage(current_percentage);

            if(this.getRegionKey()) {
                this.regionState = true;
            } else {
                this.regionState = false;
            }
        });

        this.wavesurfer.on('region-click', (region: any) => {
            this.setRegion(region);
        });

        this.wavesurfer.on('region-in', (region: Region) => {

            switch (region.data.effect) {
                case this.effects[0]:
                    this.hueService.blink();
                    break;
                case this.effects[1]:
                    this.hueService.colorLoop();
                    break;
                case this.effects[2]:
                    this.hueService.noEffect();
                    break;
            }

            //Tmp: light id's instead of this.lights
            // let light_ids = [1, 4, 8];
            let light_ids = [8];
            // let light_ids = [1, 7, 5, 3];

            for (var i = 0; i < light_ids.length; ++i) {
                this.hueService.setColor(region.color, light_ids[i]);
            }

            this.setRegion(region);

            this.regionState = true;
        });

        this.wavesurfer.on('region-out', (region: Region) => {
            this.regionState = false;
        });
    }

    ngOnDestroy() {
        this.wavesurfer.unAll();
        this.wavesurfer.stop();
    }

    setRegion(region: Region) {
        let hsl_to_rgba = this.hueService.hslToRgbString(region.data.colors[0]);

        this.region = region;

        this.effect = region.data.effect;
        this.color = this.window.colorcolor(hsl_to_rgba, 'hex');
        this.playColor = region.color.slice(0, region.color.length - 3) + "1)";
    }

    getDefaultLights() {
        this.hueService.getLights().then( (lights) => {
            this.lights = lights;
        });
    }

    generateLightshow() {
        let l = Math.round(this.wavesurfer.getDuration());

        let incrementer = 1;

        if(l > 200) {
            incrementer = 2;
        }

        if(l > 300) {
            incrementer = 3;
        }

        for (var i = 1; i < l; i = i + incrementer) {
            let previousRegion = (this.previousRegion || this.previousRegion == 0) ? this.previousRegion : i + incrementer;
            this.generateLightshowPart( previousRegion, i );
        }
    }

    generateLightshowPart(from, to) {

        var nominalWidth = Math.round(
            this.wavesurfer.getDuration() * this.wavesurfer.params.minPxPerSec * this.wavesurfer.params.pixelRatio
        );

        let p = this.wavesurfer.backend.getPeaks(nominalWidth, from, to);

        for (var i = p.length - 1; i >= 0; i--) {
            let val = Math.round(p[i] * 100);

            if( val > 10 ) {

                let region_color = 'hsla('+ (360/val*10) +', 50%, 45%, .3)';

                // Needed to remove doubles
                if(this.wavesurfer.regions && this.wavesurfer.regions.list) {
                    let added_region = this.wavesurfer.regions.list;

                    for ( var i=0, len=added_region.length; i < len; i++ ) {
                        if( added_region[i]['start'] == from || added_region[i]['color'] == region_color ) {
                            return;
                        }
                    }
                }

                let effect = Math.floor(Math.random() * this.effects.length);

                let colors = [ region_color ];

                for (let color_i = 1; color_i < this.lights.length; color_i++) {
                    colors.push( 'hsla('+ ( 360/val * (10 + i * 10) ) +', 50%, 45%, .3)' )
                }

                // Add the region to wavesurfer
                let region = this.wavesurfer.addRegion({
                    start: from,
                    end: to,
                    color: region_color,
                    resize: true,
                    drag: true,
                    data: {
                        effect: this.effects[effect],
                        colors: colors
                    }
                });

                this.previousRegion = to;
            }
        }
    }

    getRegionKey(): boolean|string {
        let current = this.wavesurfer.getCurrentTime();

        for (var key in this.wavesurfer.regions.list) {

            if (!this.wavesurfer.regions.list.hasOwnProperty(key)) continue;

            var current_region = this.wavesurfer.regions.list[key];

            if( this.region.start == current_region.start ) {
                return key;
            }
        }

        return false;
    }

    removeRegion() {
        let regionKey = this.getRegionKey();

        if(regionKey) {
            this.wavesurfer.regions.list[regionKey.toString()].remove();
            this.regionState = false;
        }
    }

    setColor() {
        let color = this.window.colorcolor(this.color, 'hsla');
        color = color.slice(0,color.length - 2) + ".3)";
        return color;
    }

    editRegion() {
        let regionKey = this.getRegionKey();

        if(regionKey) {

            let color = this.setColor();
            let colors = [ color ];
            for (let color_i = 1; color_i < this.lights.length; color_i++) {
                colors.push( color )
            }

            let region = this.wavesurfer.regions.list[regionKey.toString()];

            this.wavesurfer.regions.list[regionKey.toString()].remove();

            // Add the region to wavesurfer
            this.wavesurfer.addRegion({
                start: region.start,
                end: region.end,
                color: color,
                resize: true,
                drag: true,
                data: {
                    effect: this.effect,
                    colors: colors
                }
            });
        }
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

    addRegion() {
        let dot = {
            circle_offset: this.timeline.circle_offset,
            color: this.setColor(),
            time: this.wavesurfer.getCurrentTime(),
            end: this.wavesurfer.getCurrentTime() + 3
        }

        let colors = [ dot.color ];

        for (let color_i = 1; color_i < this.lights.length; color_i++) {
            colors.push( dot.color )
        }

        // Add the region to wavesurfer
        let region = this.wavesurfer.addRegion({
            start: dot.time,
            end: dot.end,
            color: dot.color,
            resize: true,
            drag: true,
            data: {
                effect: this.effect,
                colors: colors
            }
        });
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