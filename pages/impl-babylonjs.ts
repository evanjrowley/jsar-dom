/// <reference path="node_modules/@types/wicg-file-system-access/index.d.ts" />

import {
  SpatialDocumentImpl,
  DOMParser,
  NativeDocument,
  NativeEngine,
  RequestManager,
  ResourceLoader,
  UserAgent,
  UserAgentInit,
  JSARDOM,
} from '../src';
import 'babylonjs';

import { canParseURL } from '../src/living/helpers/url';

interface EngineOnBabylonjs extends BABYLON.Engine, EventTarget { }
class EngineOnBabylonjs extends BABYLON.Engine implements NativeEngine {
  // TODO
}

class HeadlessResourceLoader implements ResourceLoader {
  fetch(url: string, options: { accept?: string; cookieJar?: any; referrer?: string; }, returnsAs: 'string'): Promise<string>;
  fetch(url: string, options: { accept?: string; cookieJar?: any; referrer?: string; }, returnsAs: 'json'): Promise<object>;
  fetch(url: string, options: { accept?: string; cookieJar?: any; referrer?: string; }, returnsAs: 'arraybuffer'): Promise<ArrayBuffer>;
  fetch<T = string | object | ArrayBuffer>(url: string, options: { accept?: string; cookieJar?: any; referrer?: string; }, returnsAs?: 'string' | 'json' | 'arraybuffer'): Promise<T>;
  fetch(url: string, options: { accept?: string; cookieJar?: any; referrer?: string; }, returnsAs?: 'string' | 'json' | 'arraybuffer'): Promise<object> | Promise<ArrayBuffer> | Promise<string> {
    if (!canParseURL(url)) {
      throw new TypeError('Invalid URL');
    }
    const urlObj = new URL(url);
    if (urlObj.protocol === 'file:') {
      throw new TypeError('file: protocol is not supported');
    } else {
      return fetch(url, options)
        .then((resp) => {
          if (returnsAs === 'string') {
            return resp.text();
          } else if (returnsAs === 'json') {
            return resp.json();
          } else if (returnsAs === 'arraybuffer') {
            return resp.arrayBuffer();
          }
        });
    }
  }
}

class UserAgentOnBabylonjs implements UserAgent {
  versionString: string = '1.0';
  vendor: string = '';
  vendorSub: string = '';
  language: string = 'zh-CN';
  languages: readonly string[] = [
    'zh-CN',
    'en-US',
  ];
  defaultStylesheet: string;
  devicePixelRatio: number;
  domParser: DOMParser;
  resourceLoader: ResourceLoader;
  requestManager: RequestManager;

  constructor(init: UserAgentInit) {
    this.defaultStylesheet = init.defaultStylesheet;
    this.devicePixelRatio = init.devicePixelRatio;
    this.resourceLoader = new HeadlessResourceLoader();
    // this.requestManager = null;
  }
  alert(message?: string): void {
    throw new Error('Method not implemented.');
  }
  confirm(message?: string): boolean {
    throw new Error('Method not implemented.');
  }
  prompt(message?: string, defaultValue?: string): string {
    throw new Error('Method not implemented.');
  }
}

class NativeDocumentOnBabylonjs extends EventTarget implements NativeDocument {
  engine: NativeEngine;
  userAgent: UserAgent;
  baseURI: string;
  console: Console;
  attachedDocument: SpatialDocumentImpl;
  closed: boolean = false;

  private _scene: BABYLON.Scene;
  private _preloadMeshes: Map<string, Array<BABYLON.AbstractMesh | BABYLON.TransformNode>> = new Map();
  private _preloadAnimationGroups: Map<string, BABYLON.AnimationGroup[]> = new Map();

  constructor(canvas: HTMLCanvasElement) {
    super();

    this.engine = new EngineOnBabylonjs(canvas, true);
    this.userAgent = new UserAgentOnBabylonjs({
      defaultStylesheet: '',
      devicePixelRatio: 1,
    });
    this.console = globalThis.console;
    this._scene = new BABYLON.Scene(this.engine);
    this._scene.clearColor = new BABYLON.Color4(0.5, 0.5, 0.5, 1);
    this._scene.debugLayer.show({
      showInspector: true,
      globalRoot: document.getElementById('babylonjs-root') as HTMLDivElement,
    });

    const hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
      'https://assets.babylonjs.com/environments/environmentSpecular.env', this._scene);
    this._scene.environmentTexture = hdrTexture;

    // create camera and targets
    const camera = new BABYLON.ArcRotateCamera(
      'camera',
      Math.PI / 2,
      Math.PI / 2,
      5,
      BABYLON.Vector3.Zero(),
      this._scene
    );
    camera.setPosition(new BABYLON.Vector3(0, 0, -10));
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), this._scene);
    light.intensity = 0.7;

    this.engine.runRenderLoop(() => {
      this._scene.render();
    });
    window.addEventListener('resize', () => {
      this.engine.resize();
    });
  }

  getNativeScene(): BABYLON.Scene {
    return this._scene;
  }
  getContainerPose(): XRPose {
    throw new Error('Method not implemented.');
  }
  getPreloadedMeshes(): Map<string, Array<BABYLON.AbstractMesh | BABYLON.TransformNode>> {
    return this._preloadMeshes;
  }
  getPreloadedAnimationGroups(): Map<string, BABYLON.AnimationGroup[]> {
    return this._preloadAnimationGroups;
  }
  observeInputEvent(name?: string): void {
    throw new Error('Method not implemented.');
  }
  createBoundTransformNode(nameOrId: string): BABYLON.TransformNode {
    throw new Error('Method not implemented.');
  }
  stop(): void {
    // TODO
  }
  close(): void {
    this.engine.stopRenderLoop();
    this.engine.dispose();
    this._scene.dispose();
  }
}

let currentDom: JSARDOM;
document.addEventListener('DOMContentLoaded', async () => {
  const canvas = document.getElementById('renderCanvas');
  const urlInput = document.getElementById('url-input') as HTMLInputElement;
  const selectBtn = document.getElementById('run-btn');
  selectBtn?.addEventListener('click', async () => {
    const entryXsmlCode = await (await fetch(urlInput?.value)).text();
    await load(entryXsmlCode, urlInput?.value);
  });
  load(`
<xsml>
  <head>
    <style>
      cube {
        rotation: 0 45 30;
      }
    </style>
  </head>
  <space>
    <cube />
  </space>
</xsml>
  `);

  async function load(code: string, urlBase: string = 'https://example.com/') {
    if (currentDom) {
      await currentDom.unload();
    }
    const nativeDocument = new NativeDocumentOnBabylonjs(canvas as HTMLCanvasElement);
    currentDom = new JSARDOM(code, {
      url: urlBase,
      nativeDocument,
    });
    await currentDom.load();
    console.log(currentDom);
  }

});
