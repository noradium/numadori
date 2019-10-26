import {BeatAction} from './BeatAction';

export interface Score {
  bpm: number;
  beat: number;
  fragments: Array<{
    assetId: string;
    beatAction: BeatAction[];
  }>;
}
