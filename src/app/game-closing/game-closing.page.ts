import {Component} from '@angular/core';
import {ModalController} from '@ionic/angular';

/**
 * page to submit that user wants to leave the whole game
 */
@Component({
    selector: 'app-game-closing',
    templateUrl: './game-closing.page.html',
    styleUrls: ['./game-closing.page.scss'],
})
export class GameClosingPage {

    /**
     * includes only modalController to control windowHandling
     * @param modalcontroller to open and close page as modalWindow
     */
    constructor(public modalcontroller: ModalController) {}
}
