import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { JamendoService } from '../shared/services/jamendo.service';

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss']
})
export class MusicComponent implements OnInit {
    songs: any;
    timeout = null;
    search: string = "";

    @Input() mp3: string;
    @Output() mp3Picked = new EventEmitter();

    constructor(
        private jamendoService: JamendoService
    ) { }

    ngOnInit() {
        this.defaulSongs();
    }

    defaulSongs() {
        this.jamendoService.getTracks("dance").then( (data) => {
            this.songs = data.results;
        });
    }

    selectSong(song) {
        this.jamendoService.getMp3Url(song.id).then( (data) => {
            this.mp3 = data.results[0].audio;
            this.mp3Picked.emit(this.mp3);
        });
    }

    searchMusic(event) {
        const search_term = event.target.value;
        this.search = search_term;

        if (!this.search) {
            this.defaulSongs();
            clearTimeout(this.timeout);
            this.timeout = null;
            return;
        }

        if (this.timeout) {
            return;
        }

        this.timeout = window.setTimeout( _ => {
            this.timeout = null;
            this.jamendoService.getTracks(this.search).then( (data) => {
                this.songs = data.results;
            });
        }, 1000);
    }
}
