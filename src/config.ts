export const config = {
  renderPixi: {
    width: 1920,
    height: 1080,
    backgroundColor: 0x1d1d1d,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  },
  assets: {
    audio: [
      { id: "chicken", src: "assets/sounds/chicken.mp3", loop: false },
      { id: "click_003", src: "assets/sounds/click_003.mp3", loop: false },
      { id: "cow", src: "assets/sounds/cow.mp3", loop: false },
      { id: "popup_chest", src: "assets/sounds/popup_chest.mp3", loop: false },
      { id: "sheep", src: "assets/sounds/sheep.mp3", loop: false },
      { id: "sheep2", src: "assets/sounds/sheep2.mp3", loop: false },
      { id: "theme", src: "assets/sounds/theme.mp3", loop: true, volume: 0.5 },
      { id: "throw_spear", src: "assets/sounds/throw_spear.mp3", loop: false },
    ],
    images: {
      bundles: [
        {
          name: "load-screen",
          assets: [
            {
              alias: "flowerTop",
              src: "https://pixijs.com/assets/flowerTop.png",
            },
          ],
        },
        {
          name: "game-screen",
          assets: [
            { alias: "corn", src: "assets/images/corn.png" },
            { alias: "cow", src: "assets/images/cow.png" },
            { alias: "grape", src: "assets/images/grape.png" },
            { alias: "leaf", src: "assets/images/leaf.jpg" },
            { alias: "money", src: "assets/images/money.png" },
            { alias: "plus-1", src: "assets/images/plus (1).png" },
            { alias: "plus-2", src: "assets/images/plus (2).png" },
            { alias: "plus", src: "assets/images/plus.png" },
            { alias: "plusButton", src: "assets/images/plus-button.png" },
            { alias: "sheep", src: "assets/images/sheep.png" },
            { alias: "skipDay", src: "assets/images/skip_day.png" },
            { alias: "smoke", src: "assets/images/smoke.png" },
            { alias: "smokeAlpha", src: "assets/images/smoke_alpha.png" },
            { alias: "strawberry", src: "assets/images/strawberry.png" },
            { alias: "tomato", src: "assets/images/tomato.png" },
            { alias: "soundOn", src: "assets/images/soundOn.png" },
            { alias: "soundOff", src: "assets/images/soundOff.png" },
          ],
        },
      ],
    },

    glb: [
      { name: "ground", srcs: "assets/gltf/ground.glb" },
      { name: "objects", srcs: "assets/gltf/objects.glb" },
    ],
  },

  camera: {
    base: {
      position: { x: -108, y: 89, z: 117 },
      rotation: { x: -0.67, y: -0.64, z: -0.42 },
    },
  },
  game: {},

  levelStatic: [
    {
      groupName: "ground",
      nodeName: "fence",
      position: [-20, -9.5, -16],
    },
    {
      groupName: "ground",
      nodeName: "fence",
      position: [-20, -9.5, -8],
    },
    {
      groupName: "ground",
      nodeName: "fence",
      position: [-20, -9.5, 0],
    },
    {
      groupName: "ground",
      nodeName: "fence",
      position: [-20, -9.5, 8],
    },
    {
      groupName: "ground",
      nodeName: "fence",
      position: [-20, -9.5, 16],
    },
    {
      groupName: "ground",
      nodeName: "fence",
      position: [18, -9.5, -16],
    },
    {
      groupName: "ground",
      nodeName: "fence",
      position: [18, -9.5, -8],
    },
    {
      groupName: "ground",
      nodeName: "fence",
      position: [18, -9.5, 0],
    },
    {
      groupName: "ground",
      nodeName: "fence",
      position: [18, -9.5, 8],
    },
    {
      groupName: "ground",
      nodeName: "fence",
      position: [18, -9.5, 16],
    },
    {
      groupName: "ground",
      nodeName: "fence",
      position: [14, -9.5, 19],
      rotation: [0, Math.PI / 2, 0],
    },
    {
      groupName: "ground",
      nodeName: "fence",
      position: [6.9, -9.5, 19],
      rotation: [0, Math.PI / 2, 0],
    },
    {
      groupName: "ground",
      nodeName: "fence",
      position: [0.9, -9.5, 19],
      rotation: [0, Math.PI / 2, 0],
    },
    {
      groupName: "ground",
      nodeName: "fence",
      position: [-6, -9.5, 19],
      rotation: [0, Math.PI / 2, 0],
    },
    {
      groupName: "ground",
      nodeName: "fence",
      position: [-12, -9.5, 19],
      rotation: [0, Math.PI / 2, 0],
    },
    {
      groupName: "ground",
      nodeName: "fence",
      position: [-17, -9.5, 19],
      rotation: [0, Math.PI / 2, 0],
    },
    {
      groupName: "ground",
      nodeName: "fence",
      position: [14, -9.5, -19],
      rotation: [0, Math.PI / 2, 0],
    },
    {
      groupName: "ground",
      nodeName: "fence",
      position: [6.9, -9.5, -19],
      rotation: [0, Math.PI / 2, 0],
    },
    {
      groupName: "ground",
      nodeName: "fence",
      position: [0.9, -9.5, -19],
      rotation: [0, Math.PI / 2, 0],
    },
    {
      groupName: "ground",
      nodeName: "fence",
      position: [-6, -9.5, -19],
      rotation: [0, Math.PI / 2, 0],
    },
    {
      groupName: "ground",
      nodeName: "fence",
      position: [-12, -9.5, -19],
      rotation: [0, Math.PI / 2, 0],
    },
    {
      groupName: "ground",
      nodeName: "fence",
      position: [-17, -9.5, -19],
      rotation: [0, Math.PI / 2, 0],
    },

    {
      groupName: "ground",
      nodeName: "bucket",
      position: [0, -9.5, -18],
    },
  ],

  grassTypes: [
    "grass001",
    "grass002",
    "grass3",
    "grass4",
    "grass3001",
    "grass3002",
    "grass3003",
    "grass3004",
    "grass3005",
    "grass3006",
    "grass3007",
    "grass3008",
    "grass3009",
    "grass3010",
    "grass4001",
    "grass4002",
  ],

  grassGrid: [
    [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
    [0, 1, 0, 1, 1, 1, 1, 0, 0, 1],
    [1, 1, 0, 0, 1, 0, 0, 0, 1, 0],
    [0, 0, 1, 1, 0, 1, 0, 1, 0, 0],
    [1, 1, 1, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 0, 0, 0, 1, 1, 0, 1],
    [1, 0, 0, 1, 0, 1, 0, 1, 1, 1],
    [0, 1, 0, 1, 1, 0, 1, 0, 1, 0],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [0, 1, 0, 1, 0, 1, 1, 0, 1, 0],
  ],

  treeGrid: [
    [0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [1, 0, 0, 0, 1, 0, 0, 1, 0, 1],
  ],
};
