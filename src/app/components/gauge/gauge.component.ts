import {Component, ElementRef, OnInit} from '@angular/core';

const DEFAULT_CONFIG = {
  viewBox: {
    width: 200,
    height: 200
  },
  spinner: {
    radius: 95,
    path: {
      color: '#a0dde8',
      width: 1,
    },
    point: {
      color: '#fff',
      width: 5,
    }
  },
  gauge: {
    radius: 80,
    width: 10,
    color: '#a0dde8',
    mark: {
      count: 100,
      color: '#a0dde8',
      width: 1
    },
    text: {
      color: '#fff',
      size: 48,
      percentColor: '#a0dde8',
      percentSize: 30
    }
  }
};

@Component({
  selector: 'app-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.css']
})
export class GaugeComponent implements OnInit {
  private config: typeof DEFAULT_CONFIG;

  private pointElement: HTMLElement;
  private gaugeElement: HTMLElement;

  private spinnerCircumference: number;
  private gaugeCircumference: number;
  private center: object;

  private isRunning = false;
  private gaugeValue = 0;

  constructor(private elementRef: ElementRef) {
    this.config = Object.assign({}, DEFAULT_CONFIG);
    this.spinnerCircumference = 2 * Math.PI * this.config.spinner.radius;
    this.gaugeCircumference = 2 * Math.PI * this.config.gauge.radius;
    this.center = {
      x: this.config.viewBox.width / 2,
      y: this.config.viewBox.height / 2
    };
  }

  ngOnInit() {
    this.pointElement = this.elementRef.nativeElement.getElementsByClassName('app-gauge__spinner-point')[0];
    this.gaugeElement = this.elementRef.nativeElement.getElementsByClassName('app-gauge__gauge')[0];
  }

  /**
   * Current status in percents
   * @returns {number}
   */
  get status(): number {
    return Math.round(this.gaugeValue * 100);
  }

  /**
   * Start the spinner
   */
  start(): void {
    this.isRunning = true;
  }

  /**
   * Stop the spinner
   */
  stop(): void {
    this.isRunning = false;
    this.pointElement.setAttribute('stroke-dashoffset', ((1 - this.gaugeValue) * this.spinnerCircumference).toString());
  }

  /**
   * Update the gauge
   * @param value - the number beween 0 and 1
   */
  update(value: number): void {
    if (!this.isRunning) {
      return;
    }
    this.gaugeValue = value > 1 ? value - Math.round(value) : value;
    this.gaugeElement.setAttribute('stroke-dashoffset', (this.gaugeCircumference * (1 - this.gaugeValue)).toString());
  }

  /**
   * Create stroke dash array for gauge's dial
   * @returns {string}
   */
  private getGaugeStrokeDashArray(): string {
    const markWidth = this.config.gauge.mark.width;
    const intervalWidth = (this.gaugeCircumference - markWidth * this.config.gauge.mark.count) / this.config.gauge.mark.count;
    return `${markWidth}, ${intervalWidth}`;
  }

  onStartStop() {
    if (this.isRunning) {
      this.stop();
    } else {
      this.start();
      let n = 0;
      const interval = window.setInterval(() => {
        this.update(n / 100);
        n += 1;
        if (n > 100) {
          window.clearInterval(interval);
          this.stop();
        }
      }, 100);
    }
  }
}
