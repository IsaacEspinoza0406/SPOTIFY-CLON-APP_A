// src/app/player/player.ts
import { Component, OnInit, inject } from '@angular/core';
import { SpotifyAlbumService } from '../services/spotify-api/spotify-album-service';
import { Album } from '../interfaces/album';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-player',
  standalone: false,
  templateUrl: './player.html',
  styleUrl: './player.css'
})
export class Player implements OnInit {

  album$: Observable<Album> | undefined;
  private _spotifyAlbum = inject(SpotifyAlbumService);

  constructor() {
  }

  ngOnInit(): void {
  }
}