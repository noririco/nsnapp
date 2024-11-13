// app config service

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  get config() {
    return {
      title: 'nsnapp',
      cacheAppStateName: 'mainAppState',
    };
  }
}
