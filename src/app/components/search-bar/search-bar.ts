import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, filter, tap } from 'rxjs/operators';
import { SpotifySearchService } from '../../services/spotify-api/spotify-search';
import { AudioService } from '../../services/audio';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-search-bar',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './search-bar.html',
    styleUrl: './search-bar.css'
})
export class SearchBar implements OnInit {
    private _searchService = inject(SpotifySearchService);
    private _audioService = inject(AudioService);
    private _router = inject(Router);
    private _route = inject(ActivatedRoute);

    searchControl = new FormControl('');

    constructor() {
        this.searchControl.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(term => {
            if (term && term.length >= 2) {
                this._router.navigate(['/'], {
                    queryParams: { search: term },
                    queryParamsHandling: 'merge'
                });
            } else if (!term) {
                this._router.navigate([], {
                    relativeTo: this._route,
                    queryParams: { search: null },
                    queryParamsHandling: 'merge'
                });
            }
        });
    }

    ngOnInit() {
        this._route.queryParams.subscribe(params => {
            if (params['search']) {
                this.searchControl.setValue(params['search'], { emitEvent: false });
            }
        });
    }

    goHome() {
        this.searchControl.setValue('', { emitEvent: false });
        this._router.navigate(['/']);
    }

    clearSearch() {
        this.searchControl.setValue('');
        this._router.navigate([], {
            relativeTo: this._route,
            queryParams: { search: null },
            queryParamsHandling: 'merge'
        });
    }
}
