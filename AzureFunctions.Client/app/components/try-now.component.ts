﻿import {Component, ViewChild, OnInit} from '@angular/core';
import {UIResource} from '../models/ui-resource';
import {BroadcastService} from '../services/broadcast.service';
import {BroadcastEvent} from '../models/broadcast-event';
import {FunctionsService} from '.././services/functions.service';
import {TranslateService, TranslatePipe} from 'ng2-translate/ng2-translate';
import {PortalResources} from '../models/portal-resources';
import {GlobalStateService} from '../services/global-state.service';
import {TooltipContentComponent} from './tooltip-content.component';
import {TooltipComponent} from './tooltip.component';

@Component({
    selector: 'try-now',
    templateUrl: 'templates/try-now.component.html',
    styleUrls: ['styles/try-now.styles.css'],
    pipes: [TranslatePipe],
    directives: [TooltipContentComponent, TooltipComponent]
})

export class TryNowComponent implements OnInit {
    public uiResource: UIResource;
    public trialExpired: boolean;
    public endTime: Date;
    public timerText: string;
    public freeTrialUri: string;
    constructor(private _functionsService: FunctionsService,
        private _broadcastService: BroadcastService,
        private _globalStateService: GlobalStateService,
        private _translateService: TranslateService) {
        this.trialExpired = false;
        //TODO: Add cookie referer details like in try
        var freeTrialExpireCachedQuery = `try_functionstimer`;
        this.freeTrialUri = `${window.location.protocol}//azure.microsoft.com/${window.navigator.language}/free?WT.mc_id=${freeTrialExpireCachedQuery}`;

        var callBack = () => {
            window.setTimeout(() => {
                var  mm;
                var now = new Date();
                var msLeft = this.endTime.getTime() - now.getTime();
                if (this.endTime >= now) {
                    //http://stackoverflow.com/questions/1787939/check-time-difference-in-javascript
                    mm = Math.floor(msLeft / 1000 / 60);
                    if (mm < 1) {
                        this.timerText = (this._translateService.instant(PortalResources.tryNow_lessThanOneMinute));
                    } else {
                        this.timerText = this.pad(mm, 2) + ' ' + this._translateService.instant(PortalResources.tryNow_minutes);
                    }
                    window.setTimeout(callBack, 1000);
                } else {
                    this.timerText = this._translateService.instant(PortalResources.tryNow_trialExpired);
                    this.trialExpired = true;
                    this._broadcastService.broadcast(BroadcastEvent.TrialExpired);
                }
            });
        };

        this._functionsService.getTrialResource()
            .subscribe((resource) => {
                this.uiResource = resource;
                this.endTime = new Date();
                this.endTime.setSeconds(this.endTime.getSeconds() + resource.timeLeft);
                callBack();
            });
    }

    ngOnInit() { }

    //http://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript
    pad(n, width) {
        var z = '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
}
