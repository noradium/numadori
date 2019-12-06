import {BeatActionStatus} from './GameManager';
import {HyoukaStamp} from '../scene/ResultSubScene';

interface MessageType {
  join: {
    id: string;
    userId: string;
    userName: string;
  };
  updateGameMasterUserName: {
    userName: string;
  };
  gameStart: void;
  tap: {
    playerId: string;
    beatIndex: number;
  };
  tapUp: {
    playerId: string;
  };
  slideDown: {
    playerId: string;
  };
  slideUp: {
    playerId: string;
  };
  miss: {
    playerId: string;
  };
  result: {
    playerId: string;
    playerName: string;
    states: BeatActionStatus[];
    points: number;
    hyouka: {
      stamp: HyoukaStamp;
    }
  };
}

interface MessageEventData<T extends keyof MessageType = keyof MessageType> {
  type: T;
  data: MessageType[T];
}

interface Handler<T extends keyof MessageType = keyof MessageType> {
  type: T;
  f: (event: MessageType[T]) => any;
}

export class Messenger {
  private handlers: Handler[] = [];

  constructor(private scene: g.Scene) {
    scene.message.add(event => this.onMessage(event));
  }

  onReceive<T extends keyof MessageType>(eventName: T, handler: (event: MessageType[T]) => any) {
    this.handlers.push({type: eventName, f: handler});
  }

  send<T extends keyof MessageType>(type: T, data: MessageType[T]) {
    g.game.raiseEvent(new g.MessageEvent({
      type,
      data
    }));
  }

  private onMessage(event: g.MessageEvent) {
    const eventData = event.data as MessageEventData;
    this.handlers.forEach(handler => {
      if (handler.type === eventData.type) {
        handler.f(eventData.data);
      }
    });
  }
}
