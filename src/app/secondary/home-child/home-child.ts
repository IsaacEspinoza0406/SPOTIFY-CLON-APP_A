import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SpotifySearchService } from '../../services/spotify-api/spotify-search';
import { SpotifyArtistResponse } from '../../interfaces/spotify-api/spotify-artist-response';
import { SpotifyTrackResponse } from '../../interfaces/spotify-api/spotify-track-response';
import { SpotifyAlbumResponse } from '../../interfaces/spotify-api/spotify-album-response';
import { AudioService } from '../../services/audio'; 
import { Track } from '../../interfaces/track'; 
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-home-child',
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './home-child.html',
  styleUrl: './home-child.css'
})
export class HomeChild implements OnInit {

  // ---Inyección de Dependencias.---
  private searchService = inject(SpotifySearchService);
  private router = inject(Router); 
  private audioService = inject(AudioService); 
  private route = inject(ActivatedRoute); 
  public tracks = signal<SpotifyTrackResponse[]>([]);
  public artists = signal<SpotifyArtistResponse[]>([]);
  public albums = signal<SpotifyAlbumResponse[]>([]);
  public currentQuery = signal<string>(''); 
  public isSearching = signal(false);

  constructor() {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const query = params.get('q'); 
      this.currentQuery.set(query || ''); 

      if (query && query.trim() !== '') {
        this.isSearching.set(true);
        this.runSearch(query); 
      } else {
        this.isSearching.set(false);
        this.tracks.set([]);
        this.artists.set([]);
        this.albums.set([]);
      }
    });
  }


  runSearch(query: string) {
    console.log(`Buscando (desde /secondary): ${query}`);
    this.searchService.search(query).subscribe(response => {
      this.tracks.set(response.tracks.items.filter(track => track.preview_url));
      this.artists.set(response.artists.items);
      this.albums.set(response.albums.items);
    });
  }

  playTrack(track: SpotifyTrackResponse) {
    console.log('Reproduciendo:', track.name);
    this.audioService.playSong(track as Track); 
  }

  goToAlbum(id: string) {
    this.router.navigate(['../album', id], { relativeTo: this.route });
  }

  goToArtist(id: string) {
    console.log('Navegando al artista:', id);
  }
}