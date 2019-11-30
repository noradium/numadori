export class Util {
  static playAudio(scene: g.Scene, assetId: string) {
    (scene.assets[assetId] as g.AudioAsset).play();
    // console.log('play: ' + assetId, scene.assets[assetId]);
  }

  static stopAudio(scene: g.Scene, assetId: string) {
    (scene.assets[assetId] as g.AudioAsset).stop();
  }

  static isAtsumaruEnv() {
    return true;
    // return typeof window !== 'undefined' && typeof (window as any).RPGAtsumaru !== 'undefined';
  }

  static saveScore(score: number): Promise<void> | void {
    return this.setRecord(1, score);
  }

  static showScoreboard(): Promise<void> | void {
    const w = window as any;
    if (
      typeof w === 'undefined' ||
      typeof w.RPGAtsumaru === 'undefined' ||
      typeof w.RPGAtsumaru.experimental === 'undefined' ||
      typeof w.RPGAtsumaru.experimental.scoreboards === 'undefined'
    ) {
      return;
    }
    return w.RPGAtsumaru.experimental.scoreboards.display(1);
  }

  private static setRecord(id: number, score: number) {
    const w = window as any;
    if (
      typeof w === 'undefined' ||
      typeof w.RPGAtsumaru === 'undefined' ||
      typeof w.RPGAtsumaru.experimental === 'undefined' ||
      typeof w.RPGAtsumaru.experimental.scoreboards === 'undefined'
    ) {
      return;
    }
    return w.RPGAtsumaru.experimental.scoreboards.setRecord(id, score);
  }
}
