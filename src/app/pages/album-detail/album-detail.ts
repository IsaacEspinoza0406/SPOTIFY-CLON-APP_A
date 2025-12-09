import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyAlbumService } from '../../services/spotify-api/spotify-album-service';
import { AudioService } from '../../services/audio';
import { Observable, map, switchMap, filter, tap } from 'rxjs';
import { Album } from '../../interfaces/album';
import { Track } from '../../interfaces/track';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-album-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './album-detail.html',
  styleUrl: './album-detail.css'
})
export class AlbumDetail implements OnInit {

  private route = inject(ActivatedRoute);
  private albumService = inject(SpotifyAlbumService);
  private audioService = inject(AudioService);

  public album$!: Observable<Album>;

  ngOnInit(): void {
    this.album$ = this.route.paramMap.pipe(
      map(params => params.get('id')),
      filter(id => !!id),
      switchMap(id => this.albumService.getAlbum(id!)),
      map(album => ({
        ...album,
        tracks: album.tracks.filter(track => track.preview_url)
      })),
      tap(album => {
        this.audioService.setPlaylist(album.tracks);
      })
    );
  }

  playTrack(track: Track) {

    this.audioService.playSong(track);
  }
}