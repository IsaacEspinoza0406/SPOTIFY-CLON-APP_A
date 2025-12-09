// src/app/player/player.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongInfo } from '../song-info/song-info';
import { Playlist } from '../playlist/playlist';
import { SpotifyAlbumService } from '../services/spotify-api/spotify-album-service';
import { Album } from '../interfaces/album';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifySearchService } from '../services/spotify-api/spotify-search';
import { AudioService } from '../services/audio';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, SongInfo, Playlist],
  templateUrl: './player.html',
  styleUrl: './player.css'
})
export class Player implements OnInit {

  album$: Observable<Album> | undefined;
  results$: Observable<any> | undefined;

  private _spotifyAlbum = inject(SpotifyAlbumService);
  private _searchService = inject(SpotifySearchService);
  private _audioService = inject(AudioService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);

  ngOnInit(): void {

    this._route.queryParams.subscribe(params => {
      const searchTerm = params['search'];

      if (searchTerm && searchTerm.length >= 2) {
        this.results$ = this._searchService.search(searchTerm);
        this.album$ = undefined;
      } else {
        this.results$ = undefined;
        this.album$ = this._spotifyAlbum.getAlbum('1A2GTWGtFfWp7M9BHMD7O');
      }
    });
  }

  playTrack(track: any, playlist: any[] = []) {
    const adaptedTrack = {
      id: track.id,
      name: track.name,
      duration_ms: track.duration_ms,
      href: track.href,
      preview_url: track.preview_url,
      artists: track.artists,
    };

    if (playlist && playlist.length > 0) {
      const adaptedPlaylist = playlist.map(t => ({
        id: t.id,
        name: t.name,
        duration_ms: t.duration_ms,
        href: t.href,
        preview_url: t.preview_url,
        artists: t.artists,
      })).filter(t => t.preview_url);

      this._audioService.setPlaylist(adaptedPlaylist);
    }

    this._audioService.playSong(adaptedTrack);

    if (track.album && track.album.id) {
      this._router.navigate(['/secondary/album', track.album.id]);
    }
  }

  clickAlbum(album: any) {
    if (album && album.id) {
      this._router.navigate(['/secondary/album', album.id]);
    }
  }

  clickArtist(artist: any) {

  }
}