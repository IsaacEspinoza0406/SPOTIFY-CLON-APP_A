import { Component, OnInit, signal } from '@angular/core';
import { SpotifyLoginService } from './services/spotify-api/spotify-login-service';
import { CookiesStorageService } from './services/general/cookies-storage-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {
  isReady = signal(false);

  constructor(
    private _spotifyLogin: SpotifyLoginService,
    private _cookieStorage: CookiesStorageService
  ) { }

  ngOnInit(): void {
    if (this._cookieStorage.exists('access_token') && this._cookieStorage.isCookieValid('access_token')) {
      this.isReady.set(true);
    } else {
      this._spotifyLogin.getAccessToken().subscribe({
        next: (data) => {
          const expiresAt = new Date(new Date().getTime() + (data.expires_in * 1000));
          this._cookieStorage.setKey('access_token', data.access_token, expiresAt);
          this.isReady.set(true);
        },
        error: (err) => {
          console.error('Failed to get token', err);
        }
      });
    }
  }
}
