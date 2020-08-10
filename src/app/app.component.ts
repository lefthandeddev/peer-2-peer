import { Component } from '@angular/core';
import { PeerService } from './services/peer/peer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  myId: string = '';
  theirId: string = '';
  _theirId = '';
  data: string[] = [];
  message: string = '';

  constructor(private peerService: PeerService) {
    peerService.peerEvents.open.subscribe((id) => (this.myId = id));
    peerService.peerEvents.connection.subscribe((id) => {
      this._theirId = id;
      this.theirId = id;
    });
    this.peerService.peerEvents.data.subscribe((data) => {
      this.data.push(data);
    });
  }

  connect() {
    this.peerService.connect(this.theirId);
  }

  send() {
    this.peerService.send(this.message);
    this.message = '';
  }
}
