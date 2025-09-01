import { Container, Text, Graphics } from 'pixi.js';
import type { IGame } from '@sharedTypes';

export class TimeDisplay extends Container {
  private game: IGame;
  private timeText!: Text;
  private timeOfDayText!: Text;
  private background!: Graphics;
  private timeContainer!: Container;

  constructor(game: IGame) {
    super();
    this.game = game;

    this.setupUI();
    this.setupEventListeners();

    this.game.eventService.on('RESIZE', () => {
      this.resize();
    });
    this.resize();
  }

  private setupUI(): void {
    this.timeContainer = new Container();

    this.background = new Graphics();

    this.background.beginFill(0x1a1a1a, 0.9);
    this.background.lineStyle(2, 0x444444, 0.8);
    this.background.drawRoundedRect(0, 0, 180, 60, 12);
    this.background.endFill();

    this.background.beginFill(0x333333, 0.3);
    this.background.drawRoundedRect(2, 2, 176, 56, 10);
    this.background.endFill();

    this.timeContainer.addChild(this.background);

    this.timeText = new Text('00:00', {
      fontFamily: 'Arial, sans-serif',
      fontSize: 28,
      fontWeight: 'bold',
      fill: 0xffffff,
      align: 'center',
    });
    this.timeText.position.set(90, 8);
    this.timeText.anchor.set(0.5, 0);
    this.timeContainer.addChild(this.timeText);

    this.timeOfDayText = new Text('DAY', {
      fontFamily: 'Arial, sans-serif',
      fontSize: 14,
      fontWeight: 'bold',
      fill: 0xffffff,
      align: 'center',
    });
    this.timeOfDayText.position.set(90, 40);
    this.timeOfDayText.anchor.set(0.5, 0);
    this.timeContainer.addChild(this.timeOfDayText);

    const accentLine = new Graphics();
    accentLine.lineStyle(2, 0x666666, 0.6);
    accentLine.moveTo(20, 35);
    accentLine.lineTo(160, 35);
    this.timeContainer.addChild(accentLine);

    this.addChild(this.timeContainer);

    this.position.set(window.innerWidth - 200, 25);
  }

  private setupEventListeners(): void {
    this.game.eventService.on('DAY:TIME_UPDATE', () => {
      this.updateDisplay();
    });

    this.game.eventService.on('DAY:HOUR_CHANGED', () => {
      this.updateDisplay();
    });

    this.game.eventService.on('DAY:NEXT_DAY', () => {
      this.updateDisplay();
    });
  }

  private updateDisplay(): void {
    const dayNightService = this.game.dayNightService;

    this.timeText.text = dayNightService.getFormattedTime();

    this.timeOfDayText.text = dayNightService.getTimeOfDayString().toUpperCase();

    const timeOfDay = dayNightService.getTimeOfDayString().toLowerCase();
    switch (timeOfDay) {
      case 'day':
        this.timeOfDayText.style.fill = 0x00ff88;
        break;
      case 'night':
        this.timeOfDayText.style.fill = 0x4d9de0;
        break;
      case 'sunrise':
        this.timeOfDayText.style.fill = 0xff6b6b;
        break;
      case 'sunset':
        this.timeOfDayText.style.fill = 0xffa500;
        break;
    }
  }

  public resize(): void {
    this.position.set(window.innerWidth - 100, 100);
  }
}
