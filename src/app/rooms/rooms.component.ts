import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output,
  Input
} from "@angular/core";
import { Subscription } from "rxjs";
import { tap } from "rxjs/operators";
import { NamedRoom, VideoChatService } from "../services/videochat.service";

@Component({
  selector: "app-rooms",
  styleUrls: ["./rooms.component.css"],
  templateUrl: "./rooms.component.html"
})
export class RoomsComponent implements OnInit, OnDestroy {
  @Output() roomChanged = new EventEmitter<string>();
  @Input() activeRoomName: string;

  roomName: string;
  rooms: NamedRoom[];

  private subscription: Subscription;

  constructor(private readonly videoChatService: VideoChatService) {}

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onJoinRoom(roomName: string) {
    this.roomChanged.emit(roomName);
  }
}
