import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  template: `
    <div class="loader">
      <div class="loader-inner">
        <div class="loader-item"></div>
        <div class="loader-item"></div>
        <div class="loader-item"></div>
        <div class="loader-item"></div>
      </div>
    </div>
  `,
  styles: [
    `
      .loader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.5);
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .loader-inner {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100px;
        height: 100px;
      }

      .loader-item {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #fff;
        animation: loader-item 1s ease-in-out infinite;
      }

      @keyframes loader-item {
        0% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(30px);
        }
        100% {
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class LoaderComponent {}
