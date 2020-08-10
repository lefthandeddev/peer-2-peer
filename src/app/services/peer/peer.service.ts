import { Injectable } from '@angular/core';
import Peer, { DataConnection } from 'peerjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PeerService {
  private peer: Peer;
  private conn!: DataConnection;

  peerEvents: PeerEvents;

  constructor() {
    this.peer = new Peer();

    this.peerEvents = {
      open: new Subject<string>(),
      connection: new Subject<string>(),
      data: new Subject<any>(),
    };

    this.peer.on('open', (id: string) => {
      this.peerEvents.open.next(id);
    });

    this.peer.on('connection', (conn: DataConnection) => {
      this.conn = conn;
      this.peerEvents.connection.next(this.conn.peer);
      registerConnEvents(this.conn, (data) => {
        this.peerEvents.data.next(data);
      });
    });
  }

  connect(peerId: string) {
    this.conn = this.peer.connect(peerId);
    registerConnEvents(this.conn, (data) => {
      this.peerEvents.data.next(data);
    });
  }

  send(message: string) {
    this.conn.send(message);
  }
}

interface PeerEvents {
  open: Subject<string>;
  connection: Subject<string>;
  data: Subject<any>;
}

const registerConnEvents = (
  conn: DataConnection,
  dataHandler: (data: any) => void
) => {
  conn.on('open', () => {
    conn.on('data', dataHandler);
  });
};
