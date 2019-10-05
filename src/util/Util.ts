export class Util {
  static playAudio(scene: g.Scene, assetId: string) {
    (scene.assets[assetId] as g.AudioAsset).play();
  }

  static stopAudio(scene: g.Scene, assetId: string) {
    (scene.assets[assetId] as g.AudioAsset).stop();
  }
}
