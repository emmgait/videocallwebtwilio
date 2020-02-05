import { connect, ConnectOptions, LocalTrack, Room } from "twilio-video";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ReplaySubject, Observable } from "rxjs";

interface AuthToken {
  token: string;
}

export interface NamedRoom {
  id: string;
  name: string;
  maxParticipants?: number;
  participantCount: number;
}

export type Rooms = NamedRoom[];

@Injectable({
  providedIn: "root"
})
export class VideoChatService {
  $roomsUpdated: Observable<boolean>;

  private roomBroadcast = new ReplaySubject<boolean>();

  constructor(private readonly http: HttpClient) {
    this.$roomsUpdated = this.roomBroadcast.asObservable();
  }
  
  // private async getAuthToken() {
  //   const auth = await this.http.get<AuthToken>(`api/video/token`).toPromise();

  //   return auth.token;
  // }


  async joinOrCreateRoom(name: string, tracks: LocalTrack[]) {
    console.log("inside video chat service");
    let room: Room = null;
    try {
      const token =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTS2E1OTk2ZDdmMTZkYjU0ZDYxOWQ4OTgxZTYyZjE4YzliLTE1ODA5MDU4MjUiLCJpc3MiOiJTS2E1OTk2ZDdmMTZkYjU0ZDYxOWQ4OTgxZTYyZjE4YzliIiwic3ViIjoiQUMxZDIxOWZlYzgwZTkzNGEyMDdhN2MzM2JhZGJhMmRkNiIsImV4cCI6MTU4MDkwOTQyNSwiZ3JhbnRzIjp7ImlkZW50aXR5IjoidGVzdElEIiwidmlkZW8iOnsicm9vbSI6IndlYlJvb20ifX19.ZgvLPBpPpLwnc28F11pd7wh0V6gzXx2OQY2-QTY1hRo";
      room = await connect(token, {
        name,
        tracks,
        dominantSpeaker: true
      } as ConnectOptions);
    } catch (error) {
      console.error(`Unable to connect to Room: ${error.message}`);
    } finally {
      if (room) {
        this.roomBroadcast.next(true);
      }
    }

    return room;
  }

  nudge() {
    this.roomBroadcast.next(true);
  }
}
