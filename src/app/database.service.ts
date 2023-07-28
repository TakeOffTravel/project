import { Injectable, SimpleChanges } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  data: any = {

    sections: [],
    testimonials: [],
    questions: [],
    allOffers: [],
    offers: [],
    offersCats: [],
    trend: [],
    offSwiper: [],
  }
  private allData = new BehaviorSubject<any>(this.data);
  myData = this.allData.asObservable();

  constructor() {
    this.getSections();
  }

  changeData(obj: any) {
    this.allData.next(obj)
  }

  api(path: String, method: String, obj: any): Promise<Response> {
    let p = 'https://beaapis.com/1' + path;
    method = method.toUpperCase();
    if (method == 'GET') {
      obj = this.queryStringEncode(obj);
      p += ('?' + new URLSearchParams(obj));
    }
    let o: any = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        "X-BEA-Application-ID": "fmvXhJD8y762E1qDkxcXWQJWcMaa3ds67i7WEA0wBkk",
        "X-BEA-Authorization": "lnsONvkZXx4orqYMmEYDgTfdv2VbXvRCJBRThdKAkoQ",
      }
    };
    if (method != 'GET') o['body'] = JSON.stringify(obj);
    return fetch(p, o);
  }

  appendJsFile() {
    var oldFile = document.querySelector('script[src="assets/js/main.js"]');
    if (oldFile) oldFile.remove();

    var my_awesome_script = document.createElement('script');
    my_awesome_script.setAttribute('src', 'assets/js/main.js');
    document.body.appendChild(my_awesome_script);
  }

  queryStringEncode(input: any): string {
    // Avoid [].includes (needs to be polyfilled)
    if (!input || [Array, Object].indexOf(input.constructor) === -1) {
      // Always return string, even for inputs that can't be serialized
      return "";
    }
    const flattened: Array<[string, string | number | boolean]> = [];
    (function flatten(input: any, path: string[]): void {
      if (!input || [Boolean, Number, String].indexOf(input.constructor) !== -1) {
        const serializedPath = path.map((key, index) => index ? `[${key}]` : key).join("");
        // Replace null and undefined with empty strings
        flattened.push([serializedPath, input == null ? "" : input]);
      } else if ([Array, Object].indexOf(input.constructor) !== -1) {
        for (const key in input) {
          if (input.hasOwnProperty(key)) {
            flatten(input[key], path.concat([key]));
          }
        }
      }
    })(input, []);
    return flattened.map(pair => pair.map(encodeURIComponent).join("=")).join("&");
  }

  getSections() {

    this.api('/batch', 'post', {
      requests: [
        {
          path: "/Testimonials",
          body: {
            fields: "Name,positionName,Text",
            limit: -1,
            locale: "En,Ar",
            media: "images"
          },
          method: "get",
        },
        {
          path: "/QnA",
          body: {
            fields: "Question,Answer",
            limit: -1,
            locale: "En,Ar",
          },
          method: "get",
        },
        {
          path: "/Sections",
          body: {
            fields: "Title,Section,Text,specs,Brief",
            limit: -1,
            locale: "En,Ar",
            media: "images"
          },
          method: "get",
        },
        {
          path: "/_Locale",
          body: {
            fields: "Key,En,Ar",
            limit: -1,
          },
          method: "get",
        },
        {
          path: "/Offers",
          body: {
            fields: "Title,categories,Text,Price",
            locale: "En,Ar",
            limit: -1,
            media: "images",
            order: "rand"
          },
          method: "get",
        },
        {
          path: "/Offers/categories",
          body: {
            locale: "En,Ar",
          },
          method: "get",
        },
        {
          path: "/Trend",
          body: {
            fields: "Title,Text",
            locale: "En,Ar",
            limit: -1,
            media: "images"
          },
          method: "get",
        }
      ]
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);


        // console.log('testimonials:', data);
        this.data.testimonials = data[0].results;


        // console.log('questions:', data);
        this.data.questions = data[1].results;



        console.log('sections:', data[2]);
        this.data.sections = data[2].results;


        // Make specs Arabic and english
        for (let index = 0; index < Object.keys(this.data.sections).length; index++) {
          let key = Object.keys(this.data.sections)[index];
          let specs: any = {
            En: [],
            Ar: []
          };
          for (let i = 0; i < this.data.sections[key]?.specs?.length; i++) {
            if (this.data.sections[key].specs[i].Name.slice(-3) == '_en') {
              this.data.sections[key].specs[i].Name = this.data.sections[key].specs[i].Name.slice(0, -3);
              specs.En.push(this.data.sections[key].specs[i]);
            }
            else {
              specs.Ar.push(this.data.sections[key].specs[i]);
            }
          }
          this.data.sections[key].specs = specs;
        }

        // only in sections (array to object + localstorage)
        let obj = Object.assign(
          {},
          ...this.data.sections.map((x: any) => ({ [x.Section]: x }))
        );
        this.data.sections = obj;


        // console.log("localstorage", this.data.sections);
        localStorage.setItem("sections", JSON.stringify(obj));

        console.log('localizations:', data[3]);
        this.data.localizations = data[3].results;

        // only in localizations (array to object + localstorage)
        obj = Object.assign(
          {},
          ...this.data.localizations.map((x: any) => ({ [x.Key]: x }))
        );
        this.data.localizations = obj;
        // console.log('localizations:', this.data.localizations);
        localStorage.setItem("localizations", JSON.stringify(obj));


        this.data.allOffers = data[4].results;
        this.data.offers = data[4].results;
        // console.log('allOffers', this.data.allOffers)

        // setTimeout(() => {
        //   let s = `new Swiper('.slides-3', {
        //   speed: 600,
        //   lazy: true, 
        //   loop: false,
        //   slidesPerView: 3,
        //   pagination: {
        //     el: '.swiper-pagination',
        //     type: 'bullets',
        //     clickable: true
        //   }
        // });`;
        //   this.data.offSwiper = eval(s);
        // }, 1000);



        this.data.offersCats = data[5].results;
        // console.log('offersCats', this.data.offersCats)
        // End

        // console.log('Trend:', data[6]);
        this.data.trend = data[6].results;

        this.changeData(this.data);

        setTimeout(() => {
          this.appendJsFile();
          setTimeout(() => {
            eval("$('#preloader').hide()")
          }, 500)
        }, 500)

        // setTimeout(() => {
        //   let offersCats: any = document.querySelectorAll("#event-flters li");
        //   for (const o of offersCats) {
        //     o.addEventListener('click', function () {
        //       for (const o of offersCats) {
        //         o.classList.remove('filter-active');
        //       }
        //       o.classList.add('filter-active');
        //     })
        //   }
        // }, 500)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }

  changeLanguage() {
    let oldLan = this.data.lan;
    if (this.data.lan == 'En') this.data.lan = 'Ar';
    else this.data.lan = 'Ar';
    document.querySelector('body')?.classList.remove(oldLan);
    document.querySelector('body')?.classList.add(this.data.lan);


    // when language changes, change the cookie
    this.setCookie("language", this.data.lan, null);
    console.log(this.data.lan)
  }


  // changeImages(cat_id: any) {
  //   this.data.offSwiper.destroy();
  //   let temp = [];
  //   if (cat_id == 'all') temp = this.data.allOffers;
  //   else {
  //     temp = [];
  //     for (let i = 0; i < this.data.allOffers.length; i++) {
  //       const element = this.data.allOffers[i];
  //       if (element.categories[0].objectId == cat_id) {
  //         temp.push(element);
  //       }
  //     }
  //   }


  //   let xx = `new Swiper('.slides-3', {
  //   speed: 600,
  //   lazy: true,
  //   loop: false,
  //   autoplay: {
  //     delay: 5000,
  //     disableOnInteraction: true
  //   },
  //   slidesPerView: 'auto',
  //   pagination: {
  //     el: '.swiper-pagination',
  //     type: 'bullets',
  //     clickable: true
  //   },
  //   navigation: {
  //     nextEl: '.swiper-button-next',
  //     prevEl: '.swiper-button-prev',
  //   },
  //   breakpoints: {
  //     320: {
  //       slidesPerView: 1,
  //       spaceBetween: 40
  //     },

  //     1200: {
  //       slidesPerView: ${temp.length < 3 ? temp.length : 3},
  //     }
  //   }
  // });`
  //   this.data.offSwiper = eval(xx);
  //   this.data.offers = temp;
  //   setTimeout(() => {
  //     this.data.offSwiper.destroy();
  //     this.data.offSwiper = eval(xx);

  //     let slides = document.querySelectorAll('.slides-3 .swiper-slide');
  //     for (let i = 0; i < slides.length; i++) {
  //       let s: any = slides[i];
  //       if (!s.style.backgroundImage) {
  //         s.style.backgroundImage = "url('" + this.data.offers[i].images.untitled[0].dir + this.data.offers[i].images.untitled[0].image + "')";
  //       }
  //     }
  //   }, 50);
  //   console.log("hiii", this.data.offers);
  // }

  // transform(url: any) {
  //   return this.data.sanitizer.bypassSecurityTrustResourceUrl(url);
  // }


  // functions related to cookies
  setCookie(name: any, value: any, days: any) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }
  getCookie(name: any) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
}





