import { Injectable, signal, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ScreenSizeService implements OnDestroy {

  readonly isMobile = signal<boolean>(false);
  readonly isDesktop = signal<boolean>(true);

  private readonly MOBILE_BREAKPOINT = 576;
  private resizeHandler?: () => void;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    if (isPlatformBrowser(platformId)) {
      this.check();
      this.resizeHandler = () => this.check();
      window.addEventListener('resize', this.resizeHandler);
    }
  }

  ngOnDestroy(): void {
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
  }

  private check(): void {
    const mobile = window.innerWidth < this.MOBILE_BREAKPOINT;
    this.isMobile.set(mobile);
    this.isDesktop.set(!mobile);
  }
}
