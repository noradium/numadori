import {BeatAction} from './BeatAction';

export default {
  bpm: 120,
  beat: 4,
  fragments: [
    {
      assetId: 'tutorial1',
      beatAction: [BeatAction.Normal, BeatAction.Normal, BeatAction.Normal, BeatAction.Normal]
    }, {
      assetId: 'tutorial3',
      beatAction: [BeatAction.Normal, BeatAction.Normal, BeatAction.Normal, BeatAction.Normal]
    }, {
      assetId: 'tutorial2',
      beatAction: [BeatAction.Normal, BeatAction.Normal, BeatAction.Normal, BeatAction.Normal]
    }, {
      assetId: 'tutorial2',
      beatAction: [BeatAction.PiPyako, BeatAction.Normal, BeatAction.Normal, BeatAction.Normal]
    }
  ]
};
