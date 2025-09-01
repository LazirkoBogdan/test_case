import * as THREE from "three";
import { EventService } from "./EventService";

export interface DayNightConfig {
  dayDuration: number;
  startTime: number;
  ambientLightIntensity: {
    day: number;
    night: number;
  };
  directionalLightIntensity: {
    day: number;
    night: number;
  };
  skyColors: {
    day: THREE.Color;
    night: THREE.Color;
    sunrise: THREE.Color;
    sunset: THREE.Color;
  };
}

export class DayNightService {
  private static instance: DayNightService;
  private eventService: EventService;
  private config: DayNightConfig;

  private currentTime: number = 0;
  private dayProgress: number = 0;
  private isDay: boolean = true;

  private ambientLight?: THREE.AmbientLight;
  private directionalLight?: THREE.DirectionalLight;
  private skyColor: THREE.Color = new THREE.Color(0x87ceeb);

  private lastUpdate: number = 0;
  private timeScale: number = 1;

  constructor() {
    this.eventService = EventService.getInstance();
    this.config = {
      dayDuration: 300,
      startTime: 6,
      ambientLightIntensity: {
        day: 1.5,
        night: 0.1,
      },
      directionalLightIntensity: {
        day: 2.0,
        night: 0.05,
      },
      skyColors: {
        day: new THREE.Color(0x87ceeb),
        night: new THREE.Color(0x0a0a1a),
        sunrise: new THREE.Color(0xff7f50),
        sunset: new THREE.Color(0xff6b35),
      },
    };

    this.currentTime = this.config.startTime;
    this.updateDayProgress();
  }

  public static getInstance(): DayNightService {
    if (!DayNightService.instance) {
      DayNightService.instance = new DayNightService();
    }
    return DayNightService.instance;
  }

  public setLights(
    ambientLight: THREE.AmbientLight,
    directionalLight: THREE.DirectionalLight,
  ): void {
    this.ambientLight = ambientLight;
    this.directionalLight = directionalLight;
    this.updateLighting();
  }

  public update(deltaTime: number): void {
    if (!this.ambientLight || !this.directionalLight) return;

    this.currentTime +=
      ((deltaTime * this.timeScale) / this.config.dayDuration) * 24;
    if (this.currentTime >= 24) {
      this.currentTime = 0;
      this.eventService.dispatch("DAY:NEXT_DAY", {
        dayNumber: this.getDayNumber(),
      });
    }

    this.updateDayProgress();
    this.updateLighting();
    this.updateSunPosition();

    this.dispatchTimeEvents();

    this.eventService.dispatch("DAY:TIME_UPDATE", {
      time: this.currentTime,
      dayProgress: this.dayProgress,
      isDay: this.isDay,
    });
  }

  private updateDayProgress(): void {
    this.dayProgress = this.currentTime / 24;
  }

  private updateLighting(): void {
    if (!this.ambientLight || !this.directionalLight) return;

    const timeOfDay = this.getTimeOfDay();
    let ambientIntensity: number;
    let directionalIntensity: number;

    switch (timeOfDay) {
      case "day":
        ambientIntensity = this.config.ambientLightIntensity.day;
        directionalIntensity = this.config.directionalLightIntensity.day;
        this.skyColor.copy(this.config.skyColors.day);
        break;
      case "night":
        ambientIntensity = this.config.ambientLightIntensity.night;
        directionalIntensity = this.config.directionalLightIntensity.night;
        this.skyColor.copy(this.config.skyColors.night);
        break;
      case "sunrise":
        ambientIntensity = THREE.MathUtils.lerp(
          this.config.ambientLightIntensity.night,
          this.config.ambientLightIntensity.day,
          0.5,
        );
        directionalIntensity = THREE.MathUtils.lerp(
          this.config.directionalLightIntensity.night,
          this.config.directionalLightIntensity.day,
          0.5,
        );
        this.skyColor.copy(this.config.skyColors.sunrise);
        break;
      case "sunset":
        ambientIntensity = THREE.MathUtils.lerp(
          this.config.ambientLightIntensity.day,
          this.config.ambientLightIntensity.night,
          0.5,
        );
        directionalIntensity = THREE.MathUtils.lerp(
          this.config.directionalLightIntensity.day,
          this.config.directionalLightIntensity.night,
          0.5,
        );
        this.skyColor.copy(this.config.skyColors.sunset);
        break;
    }

    this.ambientLight.intensity = THREE.MathUtils.lerp(
      this.ambientLight.intensity,
      ambientIntensity,
      0.05,
    );

    this.directionalLight.intensity = THREE.MathUtils.lerp(
      this.directionalLight.intensity,
      directionalIntensity,
      0.05,
    );
  }

  private updateSunPosition(): void {
    if (!this.directionalLight) return;

    const sunAngle = (this.currentTime - 6) * (Math.PI / 12); // 6 AM = 0, 6 PM = π

    const sunHeight = Math.sin(sunAngle);
    const sunDistance = 50;

    this.directionalLight.position.set(
      Math.cos(sunAngle) * sunDistance,
      Math.max(0, sunHeight * sunDistance),
      Math.sin(sunAngle) * sunDistance,
    );

    if (this.currentTime >= 6 && this.currentTime <= 18) {
      this.directionalLight.color.setHex(0xffffff);
    } else if (this.currentTime >= 18 || this.currentTime <= 6) {
      this.directionalLight.color.setHex(0xffe5cc);
    }
  }

  private dispatchTimeEvents(): void {
    const timeOfDay = this.getTimeOfDay();
    const wasDay = this.isDay;
    this.isDay = timeOfDay === "day";

    if (wasDay !== this.isDay) {
      if (this.isDay) {
        this.eventService.dispatch("DAY:DAWN", { time: this.currentTime });
      } else {
        this.eventService.dispatch("DAY:DUSK", { time: this.currentTime });
      }
    }

    const currentHour = Math.floor(this.currentTime);
    if (currentHour !== Math.floor(this.lastUpdate)) {
      this.eventService.dispatch("DAY:HOUR_CHANGED", {
        hour: currentHour,
        time: this.currentTime,
        isDay: this.isDay,
      });
      this.lastUpdate = this.currentTime;
    }
  }

  private getTimeOfDay(): "day" | "night" | "sunrise" | "sunset" {
    if (this.currentTime >= 6 && this.currentTime <= 18) {
      return "day";
    } else if (this.currentTime >= 5 && this.currentTime <= 7) {
      return "sunrise";
    } else if (this.currentTime >= 17 && this.currentTime <= 19) {
      return "sunset";
    } else {
      return "night";
    }
  }

  public getCurrentTime(): number {
    return this.currentTime;
  }

  public getDayProgress(): number {
    return this.dayProgress;
  }

  public isDayTime(): boolean {
    return this.isDay;
  }

  public getTimeOfDayString(): string {
    const timeOfDay = this.getTimeOfDay();
    return timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1);
  }

  public getFormattedTime(): string {
    const hours = Math.floor(this.currentTime);
    const minutes = Math.floor((this.currentTime % 1) * 60);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  }

  public getDayNumber(): number {
    return Math.floor(this.currentTime / 24) + 1;
  }

  public setTimeScale(scale: number): void {
    this.timeScale = Math.max(0, scale);
  }

  public getTimeScale(): number {
    return this.timeScale;
  }

  public setTime(time: number): void {
    this.currentTime = THREE.MathUtils.clamp(time, 0, 24);
    this.updateDayProgress();
    this.updateLighting();
    this.updateSunPosition();
  }

  public getSkyColor(): THREE.Color {
    return this.skyColor;
  }

  public getSkyColorHex(): number {
    return this.skyColor.getHex();
  }

  public getConfig(): DayNightConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<DayNightConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}
