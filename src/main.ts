import {MainScene} from './scene/MainScene';

function main(param: g.GameMainParameterObject): void {
  mockNicoPlugin();
  const scene = new MainScene({
    game: g.game,
    assetIds: [
      'opening',
      'medium_black_64', 'medium_black_64_glyph',
      'medium_white_64', 'medium_white_64_glyph',
      'bold_black_128', 'bold_black_128_glyph',
      'lightblue_circle_32', 'red_circle_32', 'white_circle_32', 'gray_circle_32',
      'tori', 'tori2', 'tori3', 'tori4', 'tori_tame1', 'tori_jump1', 'tori_miss1', 'asiato',
      'tutorial1', 'tutorial2', 'tutorial3',
      'music1', 'music2', 'music3', 'music4', 'music5', 'music6', 'music7', 'music8', 'music9', 'music10',
      'music11', 'music12', 'music13', 'music14', 'music15', 'music16', 'music17', 'music18', 'music19', 'music20',
      'music21', 'music22', 'music23', 'music24', 'music25', 'music26', 'music27', 'music28', 'music29', 'music30',
      'music31', 'music32', 'music33', 'music34', 'music35', 'music36', 'music37', 'music38', 'music39', 'music40',
      'music41', 'music42', 'music43', 'music44', 'music45', 'music46', 'music47', 'music48', 'music49',
      'numa_head', 'numa_tail', 'peta1', 'peta2', 'miss', 'don', 'pi',
      'great_icon', 'good_icon', 'fail_icon',
      'pi2', 'jingle_heibon', 'jingle_highlevel',
      'heibon', 'highlevel', 'perfect'
    ]
  });
  g.game.pushScene(scene);
}

function mockNicoPlugin() {
  if (g.game.external.nico) {
    return;
  }
  g.game.external.nico = {
    getAccount: (callback: (error: Error | null, user?: {id: string, name: string, premium: string | null}) => any) => {
      if (g.game.selfId == null) {
        callback(new Error('not found'));
        return;
      }
      const isPremium = Number(g.game.selfId) % 2 === 0;
      callback(null, { id: g.game.selfId, name: g.game.selfId, premium: isPremium ? 'premium' : null });
    }
  };
}

export = main;
