import * as THREE from 'three';
import * as PIXI from 'pixi.js';
import { EventService } from '@core/Service/EventService';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

import type { IRenderPixiTree } from '@sharedTypes';
import { config } from '@config';

export interface ThreeInitOptions {
  antialias?: boolean;
  stencil?: boolean;
  width?: number;
  height?: number;
  clearColor?: number;
  clearAlpha?: number;
  fov?: number;
  cameraZ?: number;
}

export class RenderPixiTree implements IRenderPixiTree {
  public renderer!: THREE.WebGLRenderer;
  public pixiRenderer!: PIXI.WebGLRenderer;
  public stage!: PIXI.Container;
  public scene!: THREE.Scene;
  public camera!: THREE.PerspectiveCamera;
  public debug = true;
  public scaleOffest = 1;
  private canvas!: HTMLCanvasElement;
  protected eventService = EventService.getInstance();

  async init() {
    this.canvas = this.createCanvas();

    await this.initialiseThree(this.canvas);
    await this.initiliastionPixi();

    this.addResizeListener();

    this.start();
  }

  addResizeListener() {
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('orientationchange', () => this.resize);
  }

  createCanvas() {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    return canvas;
  }

  async start() {
    this.render();
    this.resize();
    this.createCameraDebugUI(); // додано
  }

  async initialiseThree(canvas: HTMLCanvasElement, options: ThreeInitOptions = {}) {
    const width = WIDTH;
    const height = HEIGHT;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
      stencil: true,
    });

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.renderer.setSize(width, height);
    this.renderer.setClearColor(options.clearColor ?? 0x000000, options.clearAlpha ?? 1);

    this.scene = new THREE.Scene();
    this.setupCamera(options, width, height);

    this.scene.add(this.camera);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  private setupCamera(options: ThreeInitOptions, width: number, height: number) {
    this.camera = new THREE.PerspectiveCamera(options.fov ?? 20, width / height);

    const cameraConfig = config.camera.base;

    this.camera.position.set(cameraConfig.position.x, cameraConfig.position.y, cameraConfig.position.z);

    this.camera.rotation.set(cameraConfig.rotation.x, cameraConfig.rotation.y, cameraConfig.rotation.z);
  }

  async initiliastionPixi() {
    this.pixiRenderer = new PIXI.WebGLRenderer();

    await this.pixiRenderer.init({
      antialias: true,
      width: WIDTH,
      height: HEIGHT,
      clearBeforeRender: false,
      resolution: window.devicePixelRatio,
      view: this.canvas,
    });

    this.stage = new PIXI.Container();
    // this.pixiRenderer.resize(WIDTH, HEIGHT);
  }

  protected render() {
    // this.orbitControls.update();
    this.renderer.resetState();
    this.renderer.render(this.scene, this.camera);

    this.pixiRenderer.resetState();
    this.pixiRenderer.render({ container: this.stage });

    requestAnimationFrame(() => this.render());
  }

  public resize() {
    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;

    this.renderer.setSize(WIDTH, HEIGHT);
    this.camera.aspect = WIDTH / HEIGHT;
    this.camera.updateProjectionMatrix();

    this.resizePixi();
  }

  private resizePixi(): void {
    const { stage } = this;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    this.pixiRenderer.resize(screenWidth, screenHeight);
    const isLandscape = screenWidth > screenHeight;
    const orientation = isLandscape ? 'land' : 'port';
    const baseStage = {
      land: { width: 1920, height: 1080 },
      port: { width: 1080, height: 1920 },
    }[orientation];
    const scale = Math.min(screenWidth / baseStage.width, screenHeight / baseStage.height);
    const offsetX = (baseStage.width * scale - screenWidth) / 2;
    const offsetY = (baseStage.height * scale - screenHeight) / 2;
    stage.scale.set(scale);
    stage.position.set(-offsetX, -offsetY);
    this.scaleOffest = scale;
    this.eventService.dispatch('RESIZE', { scale: scale });
  }

  private createCameraDebugUI() {
    if (!this.debug) return;

    const debugDiv = document.createElement('div');
    debugDiv.style.position = 'fixed';
    debugDiv.style.bottom = '10px';
    debugDiv.style.right = '10px';
    debugDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    debugDiv.style.color = '#0f0';
    debugDiv.style.padding = '8px';
    debugDiv.style.fontFamily = 'monospace';
    debugDiv.style.fontSize = '12px';
    debugDiv.style.zIndex = '9999';
    document.body.appendChild(debugDiv);

    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy';
    copyButton.style.marginTop = '5px';
    copyButton.style.marginLeft = '5px';
    copyButton.style.fontSize = '10px';
    copyButton.style.cursor = 'pointer';
    debugDiv.appendChild(copyButton);

    copyButton.addEventListener('click', () => {
      const pos = this.camera.position;
      const rot = this.camera.rotation;
      const cameraInfo = `
Camera Position:
x: ${pos.x.toFixed(2)}, y: ${pos.y.toFixed(2)}, z: ${pos.z.toFixed(2)}
Camera Rotation:
x: ${rot.x.toFixed(2)}, y: ${rot.y.toFixed(2)}, z: ${rot.z.toFixed(2)}
      `;
      navigator.clipboard.writeText(cameraInfo);
    });

    const update = () => {
      const pos = this.camera.position;
      const rot = this.camera.rotation;
      debugDiv.innerHTML = `
        <div>
          <strong>Camera Position:</strong><br>
          x: ${pos.x.toFixed(2)}, y: ${pos.y.toFixed(2)}, z: ${pos.z.toFixed(2)}<br>
          <strong>Camera Rotation:</strong><br>
          x: ${rot.x.toFixed(2)}, y: ${rot.y.toFixed(2)}, z: ${rot.z.toFixed(2)}<br>
        </div>
      `;
      debugDiv.appendChild(copyButton);
      requestAnimationFrame(update);
    };

    update();
  }
}
