import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {GameInfoPage} from '../game-info/game-info.page';

/**
 * Page for choosing between the different games
 */

@Component({
    selector: 'app-game-select',
    templateUrl: './game-select.page.html',
    styleUrls: ['./game-select.page.scss'],
})
export class GameSelectPage {

    /**
     *  includes services and all necessary modals for the page
     * @param router navigates trough pages (here to game-create page after game is picked)
     * @param modalController opens GameInfoPage as ModalWindow
     */
    constructor(private router: Router,
                private modalController: ModalController
    ) {
    }

    /**
     * Navigation after selection of game
     */
    selectGame() {
        this.router.navigate(['game-create']);
    }

    /**
     * Opens modal window to display further information about the selected game
     */
    async openInfo() {
        const modal = await this.modalController.create({
            component: GameInfoPage,
            showBackdrop: true
        });
        return await modal.present();
    }
}
