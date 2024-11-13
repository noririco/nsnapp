import { Component } from '@angular/core';

@Component({
  selector: 'app-loader-v2',
  standalone: true,
  template: `
    <div class="loader-overlay">
      <div class="cube"></div>
    </div>
  `,
  styles: [
    `
      /* Full-screen overlay for the loader */
      .loader-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.8); /* Semi-transparent dark background */
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }

      /* 3D cube */
      .cube {
        width: 50px;
        height: 50px;
        background: linear-gradient(45deg, #3498db, #9b59b6);
        position: relative;
        transform-style: preserve-3d;
        animation: rotateCube 1.5s infinite linear;
      }

      .cube::before,
      .cube::after {
        content: '';
        position: absolute;
        width: 50px;
        height: 50px;
        background: inherit;
        transform: rotateY(90deg);
        transform-origin: center;
      }

      /* Animation for 3D rotation */
      @keyframes rotateCube {
        0% {
          transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
        }
        100% {
          transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
        }
      }
    `,
  ],
})
export class LoaderV2Component {}
