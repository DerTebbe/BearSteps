import {Component} from '@angular/core';
import {ModalController} from '@ionic/angular';

/**
 * includes all informations to the games
 */
@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.page.html',
  styleUrls: ['./game-info.page.scss'],
})
export class GameInfoPage {
  /**
   * constructor of the class is not in use
   * @param modalcontroller window-opening gets controlled by modalcontroller
   */
  constructor(public modalcontroller: ModalController) {}
}
