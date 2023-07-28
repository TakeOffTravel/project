import { Component, OnInit, Pipe, SimpleChanges } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],

})

export class AppComponent implements OnInit {
    constructor(private sanitizer: DomSanitizer) { }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log(changes);
    }

}



