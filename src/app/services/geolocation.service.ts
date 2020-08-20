import { Injectable } from '@angular/core';


/**
 * Service for retrieving the geolocation of a user
 */
@Injectable({
  providedIn: 'root'
})

export class GeolocationService {

    /**
     * @ignore
     */
    constructor() { }


    /**
     * Retrieves the geolocation of a user
     * @param onSuccess Callback method that is called if the location was retrieved successfully
     * @param onError Callback method that is called if an error occured while retrieving the lcoation of a user
     */
    getPosition(onSuccess, onError){
      return navigator.geolocation.getCurrentPosition(onSuccess, onError, {timeout: 5000});
  }
}
