import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.css']
})
export class AudioComponent implements OnInit {
  private webAudioPlayer = new WebAudioPlayer();

  constructor() { }

  ngOnInit() {
  }

  onMute() {
  }

  onLoad(fileInput) {
    // https://www.html5rocks.com/en/tutorials/webaudio/intro/#toc-volume
    if (fileInput.target.files && fileInput.target.files[0]) {
      console.log(fileInput.target.files[0]);
      const reader = new FileReader();

      reader.onload = (event) => {
        this.webAudioPlayer.load((<FileReader>event.target).result);
      };

      reader.readAsArrayBuffer(fileInput.target.files[0]);
    }
  }

  onPlay() {
    this.webAudioPlayer.play();
  }

  onStop() {
    // if (!this.source.stop) {
    //   this.source.stop = this.source.noteOff;
    // }
    // this.source.stop(0);
  }

  onVolumeChange(e) {
    this.webAudioPlayer.setVolume(parseInt(e.target.value, 10) / parseInt(e.target.max, 10));
  }
}

class WebAudioPlayer {
  private audioContext: any;
  private gainNode: any;
  private sourceNode: any;

  private isPlaying: boolean;
  private isMuted = false;

  constructor() {
    this.audioContext = new (<any>window).AudioContext();

    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);
    this.gainNode.gain.value = 0.5;

    this.sourceNode = this.audioContext.createBufferSource();
    this.sourceNode.connect(this.gainNode);
  }

  load(file: File) {
    this.audioContext.decodeAudioData(file)
      .then((decodedData) => {
        this.sourceNode.buffer = decodedData;
      });
  }

  play() {
    if (!this.isPlaying) {
      this.sourceNode.start(0);
      this.isPlaying = true;
    }
  }

  setVolume(value: number) {
    let gain = value;
    if (value < 0) {
      gain = 0;
    }
    if (value > 1) {
      gain = 1;
    }
    this.gainNode.gain.value = gain;
  }
}
