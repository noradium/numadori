import {Messenger} from './Messenger';

export interface Player {
  id: string;
  userId: string;
  userName: string;
}

export interface PlayerJoinEvent {
  player: Player;
}

export class PlayerJoiningManager {
  readonly onPlayerJoin: g.Trigger<PlayerJoinEvent> = new g.Trigger<PlayerJoinEvent>();
  /**
   * 0番目は必ず生主
   * 1番目以降に「参加する」表明したユーザー情報が入っている
   */
  readonly players: Player[] = [];
  private messenger: Messenger;

  constructor(private scene: g.Scene) {
    g.game.join.addOnce(this.onJoin.bind(this));

    this.messenger = new Messenger(scene);
    this.messenger.onReceive('join', event => {
      // console.log('on receive join', event);
      if (!this.players.some(player => player.id === event.id)) {
        this.players.push(event);
        this.onPlayerJoin.fire({player: event});
      }
    });
    this.messenger.onReceive('updateGameMasterUserName', event => {
      if (this.players.length === 0) {
        return;
      }
      this.players[0].userName = event.userName;
    });
  }

  isGameMaster() {
    if (this.players.length === 0) {
      return false;
    }
    return this.players[0].id === g.game.selfId;
  }

  isJoined() {
    return this.players.some(player => player.id === g.game.selfId);
  }

  join(userName: string) {
    this.messenger.send('join', {
      id: g.game.selfId,
      userId: g.game.selfId,
      userName: userName
    });
    // g.game.external.nico.getAccount((error: Error | null, user?: {id: string, name: string, premium: string | null}) => {
    //   // console.log('join', g.game.selfId);
    //   const userId = user ? user.id : g.game.selfId;
    //   const userName = user ? user.name : g.game.selfId;
    //   this.messenger.send('join', {
    //     id: g.game.selfId,
    //     userId,
    //     userName
    //   });
    // });
  }

  updateGameMasterUserName(name: string) {
    this.messenger.send('updateGameMasterUserName', {
      userName: name
    });
  }

  gameMasterPlayer() {
    return this.players[0];
  }

  me(): Player | null {
    const me = this.players.filter(player => player.id === g.game.selfId);
    if (!me) {
      return;
    }
    return me[0];
  }

  /**
   * このハンドラは、ニコ生においては生主のときのみ呼ばれる
   * @param event
   */
  private onJoin(event: g.JoinEvent) {
    if (event.player.id !== g.game.selfId) {
      return;
    }
    this.messenger.send('join', {
      id: g.game.selfId,
      userId: g.game.selfId,
      userName: 'ななし'
    });

    // this.messenger.send('join', {
    //   id: g.game.selfId,
    //   userId: null,
    //   userName: null
    // });
    // g.game.external.nico.getAccount((error: Error | null, user?: {id: string, name: string, premium: string | null}) => {
    //   // console.log('master join', g.game.selfId);
    //   const userId = user ? user.id : g.game.selfId;
    //   const userName = user ? user.name : g.game.selfId;
    //   this.messenger.send('join', {
    //     id: g.game.selfId,
    //     userId,
    //     userName
    //   });
    // });

  }
}
