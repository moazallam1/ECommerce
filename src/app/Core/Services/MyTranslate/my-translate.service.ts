import { isPlatformBrowser } from '@angular/common';
import {
  Inject,
  inject,
  Injectable,
  PLATFORM_ID,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root',
})
export class MyTranslateService {
  private readonly renderer2 = inject(RendererFactory2).createRenderer(null, null);

  constructor(
    private translateService: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    
    
    if (isPlatformBrowser(this.platformId)) {
      //1
      this.translateService.setDefaultLang('en');

      //2
      const savedLang = localStorage.getItem('lang');
      //3
      if (savedLang) {
        this.translateService.use(savedLang);
      }

      this.changeDirection()

    }
  }


  changeDirection():void {

    if (localStorage.getItem('lang')==='en') {
      this.renderer2.setAttribute(document.documentElement,'dir','ltr');
      this.renderer2.setAttribute(document.documentElement,'lang','en');
    }else  if (localStorage.getItem('lang')==='ar') {
      this.renderer2.setAttribute(document.documentElement,'dir','rtl');
      this.renderer2.setAttribute(document.documentElement,'lang','ar');
    }

  }


    changeLanguageTranslate(language: string){
      localStorage.setItem('lang',language);
      this.translateService.use(language);
      this.changeDirection()

    }


}
