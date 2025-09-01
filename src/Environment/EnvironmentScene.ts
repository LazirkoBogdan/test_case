import type { IGame } from "@sharedTypes";
import * as THREE from "three";
import { StaticBuilder } from "./Builder/StaticBuilder";
import { config } from "@config";
import dat from "dat.gui";
import { AssetCache } from "@core/AssetsLoader/AssetsCache";

export class EnvironmentScene extends THREE.Scene {
  game: IGame;
  ground!: THREE.Object3D;

  constructor(game: IGame) {
    super();
    this.game = game;
    this.game.render.scene.add(this);
    this.game.envaironmentScene = this;

    this.initializeEnvironment();
  }

  protected initializeEnvironment() {
    this.setupLightScene();
    this.setupGround();
    this.setupStatics();
    this.placeTreeGrid();
    this.placeGrassFromGrid(config.grassGrid, this.game.assetCache, this);
    this.testLog();
  }

  protected setupLightScene() {
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(2, 10, 4);
    dirLight.castShadow = true;

    dirLight.shadow.mapSize.set(2048, 2048);
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 100;
    dirLight.shadow.camera.left = -50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -50;

    this.add(dirLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.add(ambientLight);

    this.game.dayNightService.setLights(ambientLight, dirLight);

    this.setupLightGUI(dirLight);
  }

  protected setupGround() {
    const geometry_grass = new THREE.BoxGeometry(40, 1, 40);
    const material_grass = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const ground_grass = new THREE.Mesh(geometry_grass, material_grass);
    ground_grass.position.y = -10;
    ground_grass.position.x = -1;
    ground_grass.receiveShadow = true;
    ground_grass.castShadow = false;
    ground_grass.name = "ground";
    this.add(ground_grass);
    this.ground = ground_grass;

    const geometry_rock = new THREE.BoxGeometry(40, 40, 40);
    const material_rock = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const ground_rock = new THREE.Mesh(geometry_rock, material_rock);
    ground_rock.position.y = -30.5;
    ground_rock.position.x = -1;
    ground_rock.receiveShadow = true;
    ground_rock.castShadow = false;
    ground_rock.name = "rock";
    this.add(ground_rock);
  }

  protected setupStatics() {
    const staticConfigs = config.levelStatic as any[];
    if (!staticConfigs) return;

    const staticBuilder = new StaticBuilder(this.game.assetCache);
    const objects: THREE.Object3D[] = staticBuilder.build(staticConfigs);
    objects.forEach((obj) => {
      if (obj.children) {
        obj.traverse((child: THREE.Object3D) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = false;
          }
        });
      }
      this.add(obj);
    });
  }

  protected placeTreeGrid() {
    const treePrefabs = this.getTreePrefabs();
    if (treePrefabs.length === 0) return;

    const treeGrid = config.treeGrid;
    this.placeTreesFromGridWithRandomTrees(treeGrid, treePrefabs, this);
  }

  protected getTreePrefabs(): THREE.Object3D[] {
    const tree = this.game.assetCache.getGLTFGroupByName("ground", "tree");
    const tree1 = this.game.assetCache.getGLTFGroupByName("ground", "tree1");
    return [tree, tree1].filter(Boolean) as THREE.Object3D[];
  }

  protected placeTreesFromGridWithRandomTrees(
    grid: number[][],
    treePrefabs: THREE.Object3D[],
    scene: THREE.Scene,
  ) {
    const cellSize = 4;
    const startX = -19;
    const startZ = -18;

    for (let z = 0; z < grid.length; z++) {
      for (let x = 0; x < grid[z].length; x++) {
        if (grid[z][x] === 1) {
          const prefab =
            treePrefabs[Math.floor(Math.random() * treePrefabs.length)];
          const tree = prefab.clone();
          tree.position.set(startX + x * cellSize, -9.5, startZ + z * cellSize);
          tree.traverse((child: THREE.Object3D) => {
            child.castShadow = true;
          });
          scene.add(tree);
        }
      }
    }
  }

  protected placeGrassFromGrid(
    grid: number[][],
    assetCache: AssetCache,
    parent: THREE.Scene,
  ) {
    const size = 4;
    const offsetX = -((grid[0].length * size) / 2);
    const offsetZ = -((grid.length * size) / 2);

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col] === 1) {
          const grassName =
            config.grassTypes[
              Math.floor(Math.random() * config.grassTypes.length)
            ];
          const group = assetCache.getGLTFGroupByName("ground", grassName);
          if (group) {
            const grass = group.clone();
            grass.position.set(
              col * size + offsetX,
              -9.5,
              row * size + offsetZ,
            );
            grass.traverse((child: any) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });
            parent.add(grass);
          }
        }
      }
    }
  }

  protected testLog() {
    this.game.assetCache.logAllGLTFGroupNames();
  }

  protected setupLightGUI(dirLight: THREE.DirectionalLight) {
    const gui = new dat.GUI();
    const lightFolder = gui.addFolder("Directional Light Position");
    const lightPosition = {
      x: dirLight.position.x,
      y: dirLight.position.y,
      z: dirLight.position.z,
    };

    lightFolder.add(lightPosition, "x", -50, 50).onChange((val: number) => {
      dirLight.position.x = val;
    });
    lightFolder.add(lightPosition, "y", -50, 50).onChange((val: number) => {
      dirLight.position.y = val;
    });
    lightFolder.add(lightPosition, "z", -50, 50).onChange((val: number) => {
      dirLight.position.z = val;
    });

    lightFolder.open();

    const dayNightFolder = gui.addFolder("Day/Night Cycle");
    const dayNightControls = {
      timeScale: this.game.dayNightService.getTimeScale(),
      currentTime: this.game.dayNightService.getCurrentTime(),
      timeOfDay: this.game.dayNightService.getTimeOfDayString(),
      dayNumber: this.game.dayNightService.getDayNumber(),
    };

    dayNightFolder
      .add(dayNightControls, "timeScale", 0, 10)
      .name("Time Speed")
      .onChange((val: number) => {
        this.game.dayNightService.setTimeScale(val);
        dayNightControls.timeScale = val;
      });

    const timeController = dayNightFolder
      .add(dayNightControls, "currentTime", 0, 24)
      .name("Time of Day")
      .step(0.1)
      .onChange((val: number) => {
        this.game.dayNightService.setTime(val);
        dayNightControls.currentTime = val;
        dayNightControls.timeOfDay =
          this.game.dayNightService.getTimeOfDayString();
        timeOfDayController.updateDisplay();
      });

    const timeOfDayController = dayNightFolder
      .add(dayNightControls, "timeOfDay")
      .name("Current Period")
      .listen();

    const dayNumberController = dayNightFolder
      .add(dayNightControls, "dayNumber")
      .name("Day")
      .listen();

    const quickTimeFolder = dayNightFolder.addFolder("Quick Time");

    quickTimeFolder
      .add(
        {
          jumpTo: () => {
            this.game.dayNightService.setTime(6);
            timeController.setValue(6);
            dayNightControls.currentTime = 6;
            dayNightControls.timeOfDay =
              this.game.dayNightService.getTimeOfDayString();
            timeOfDayController.updateDisplay();
          },
        },
        "jumpTo",
      )
      .name("6 AM (Dawn)");

    quickTimeFolder
      .add(
        {
          jumpTo: () => {
            this.game.dayNightService.setTime(12);
            timeController.setValue(12);
            dayNightControls.currentTime = 12;
            dayNightControls.timeOfDay =
              this.game.dayNightService.getTimeOfDayString();
            timeOfDayController.updateDisplay();
          },
        },
        "jumpTo",
      )
      .name("12 PM (Noon)");

    quickTimeFolder
      .add(
        {
          jumpTo: () => {
            this.game.dayNightService.setTime(18);
            timeController.setValue(18);
            dayNightControls.currentTime = 18;
            dayNightControls.timeOfDay =
              this.game.dayNightService.getTimeOfDayString();
            timeOfDayController.updateDisplay();
          },
        },
        "jumpTo",
      )
      .name("6 PM (Dusk)");

    quickTimeFolder
      .add(
        {
          jumpTo: () => {
            this.game.dayNightService.setTime(0);
            timeController.setValue(0);
            dayNightControls.currentTime = 0;
            dayNightControls.timeOfDay =
              this.game.dayNightService.getTimeOfDayString();
            timeOfDayController.updateDisplay();
          },
        },
        "jumpTo",
      )
      .name("12 AM (Midnight)");

    quickTimeFolder.open();
    dayNightFolder.open();

    setInterval(() => {
      dayNightControls.currentTime = this.game.dayNightService.getCurrentTime();
      dayNightControls.timeOfDay =
        this.game.dayNightService.getTimeOfDayString();
      dayNightControls.dayNumber = this.game.dayNightService.getDayNumber();

      timeController.updateDisplay();
      timeOfDayController.updateDisplay();
      dayNumberController.updateDisplay();
    }, 100);
  }

  public update(deltaTime: number): void {
    this.game.dayNightService.update(deltaTime);

    const skyColor = this.game.dayNightService.getSkyColor();
    this.background = skyColor;

    if (this.game.render.renderer) {
      this.game.render.renderer.setClearColor(skyColor);
    }
  }
}
