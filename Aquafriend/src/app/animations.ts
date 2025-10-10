// Script para activar animaciones cuando los elementos entran en el viewport
export class AnimationController {
  private observer: IntersectionObserver;

  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );
  }

  init() {
    // Observar todos los elementos con clases de animación
    const animatedElements = document.querySelectorAll(
      '.fade-in-up, .fade-in-left, .fade-in-right, .scale-in'
    );

    animatedElements.forEach((element) => {
      this.observer.observe(element);
    });

    // Efecto parallax suave para el hero
    this.initParallax();
    
    // Efectos de hover mejorados para las tarjetas
    this.initCardEffects();
  }

  private initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallax = hero.querySelector('.hero-bg') as HTMLElement;
      
      if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
      }
    });
  }

  private initCardEffects() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        card.classList.add('hovered');
      });
      
      card.addEventListener('mouseleave', () => {
        card.classList.remove('hovered');
      });
    });
  }

  destroy() {
    this.observer.disconnect();
  }
}

// Función para inicializar las animaciones
export function initAnimations() {
  const animationController = new AnimationController();
  animationController.init();
  return animationController;
}
