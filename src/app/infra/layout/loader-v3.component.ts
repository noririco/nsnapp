import { Component, inject } from '@angular/core';
import { QuoteGeneratorStore } from '../../store/quote-generator.store';

@Component({
  selector: 'app-loader-v3',
  standalone: true,
  template: `
    <div class="loader-overlay">
      <div class="sphere"></div>
      <div class="quote">
        <p>{{ quoteGeneratorStore.randomQuote() }}</p>
      </div>
    </div>
  `,
  styles: [
    `
      .loader-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.85); /* Dark overlay */
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        text-align: center;
        z-index: 1000;
      }

      /* 3D Sphere */
      .sphere {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: linear-gradient(45deg, #ff6b6b, #f7b42c);
        position: relative;
        transform-style: preserve-3d;
        animation: rotateSphere 2s infinite linear;
      }

      .sphere::before,
      .sphere::after {
        content: '';
        position: absolute;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: inherit;
        opacity: 0.8;
        transform: rotateY(90deg);
        transform-origin: center;
      }

      /* Animation for 3D rotation */
      @keyframes rotateSphere {
        0% {
          transform: rotateX(0deg) rotateY(0deg);
        }
        100% {
          transform: rotateX(360deg) rotateY(360deg);
        }
      }

      /* Quote text styling */
      .quote {
        padding: 26px;
      }

      .quote p {
        margin-top: 20px;
        font-size: 1.2em;
        color: #ddd;
        font-style: italic;
        line-height: 1.5;
        animation: fadeIn 1.5s ease-in-out infinite;
      }

      /* Subtle fade-in effect for text */
      @keyframes fadeIn {
        0%,
        100% {
          opacity: 0.7;
        }
        50% {
          opacity: 1;
        }
      }
    `,
  ],
})
export class LoaderV3Component {
  quoteGeneratorStore = inject(QuoteGeneratorStore);

  ngOnInit() {
    this.quoteGeneratorStore.getRandomQuote();
  }
}
