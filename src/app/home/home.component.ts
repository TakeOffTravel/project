import { Component, OnInit, Pipe, PipeTransform, SimpleChanges } from '@angular/core';
import { DatabaseService } from './../database.service';
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  myForm: FormGroup = new FormGroup({});
  contactForm: FormGroup = new FormGroup({});

  submitted = false;
  minReturnDate: string | undefined;

  constructor(private formBuilder: FormBuilder, private sanitizer: DomSanitizer, private dbService: DatabaseService, private route: ActivatedRoute) {
    this.myForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      from: ['', Validators.required],
      to: ['', Validators.required],
      ticketType: ['one-way', Validators.required],
      travelersNumber: [1, Validators.required],
      travelDate: ['', Validators.required],
      returnDate: [''],
      car: [false],
      visa: [false],
      hotel: [false],
      hotelName: [''],
      message: [''],

    });


    this.myForm.get('ticketType')?.valueChanges.subscribe((value) => {

      const returnDateControl = this.myForm.get('returnDate');
      console.log("hello", value, returnDateControl);

      if (value === 'round-trip') {
        returnDateControl?.setValidators(Validators.required);
      } else {
        returnDateControl?.clearValidators();
      }

      returnDateControl?.updateValueAndValidity();
    });
    this.contactForm = this.formBuilder.group({
      contactName: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactSubject: ['', Validators.required],
      contactMessage: ['', Validators.required]
    });

  }
  getCurrentDate(): string {
    // Get the current date in YYYY-MM-DD format
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  updateReturnDateMin(): void {
    // Get the value of the travelDate input and set it as the minimum date for returnDate
    const travelDateValue = this.myForm.get('travelDate')?.value;
    this.minReturnDate = travelDateValue;
  }

  onSubmit() {
    this.submitted = true;

    console.log("Foorm", this.myForm)
    if (this.myForm.invalid) {
      // Mark all form controls as touched to trigger validation messages
      Object.values(this.myForm.controls).forEach((control: AbstractControl) => {
        control.markAsTouched();
      });
      return;
    }
    else {
      alert("ok1");
    }

  }

  onSubmit2() {
    this.submitted = true;

    console.log("Foorm", this.contactForm)
    if (this.contactForm.invalid) {
      // Mark all form controls as touched to trigger validation messages
      Object.values(this.contactForm.controls).forEach((control: AbstractControl) => {
        control.markAsTouched();
      });
      return;
    }
    else {
      alert("ok2");
    }


  }

  sections: any = [];
  testimonials: any = [];
  questions: any = [];
  allOffers: any = [];
  offers: any = [];
  offersCats: any = [];
  trend: any = [];
  offSwiper: any;
  fragment: any;
  localizations: any = [];
  // read language from cookie if exist, otherwise, its En
  lan: any = this.dbService.getCookie("language") ? this.dbService.getCookie("language") : "En";
  changeLanguage(l: any) {
    let oldLan = this.lan;
    this.lan = l;
    document.querySelector('body')?.classList.remove(oldLan);
    document.querySelector('body')?.classList.add(this.lan);

    // when language changes, change the cookie
  }



  ngOnInit(): void {
    eval("$('#preloader').show()")

    this.dbService.changeLanguage();
    // this.dbService.appendJsFile();
    this.route.fragment.subscribe((fragment: any) => { this.fragment = fragment; });

    this.sections = this.dbService.data.sections;
    this.testimonials = this.dbService.data.testimonials;
    this.questions = this.dbService.data.questions;
    this.allOffers = this.dbService.data.allOffers;
    this.offers = this.dbService.data.offers;
    this.offersCats = this.dbService.data.offersCats;
    this.trend = this.dbService.data.trend;
    this.offSwiper = this.dbService.data.offSwiper;
    this.localizations = this.dbService.data.localizations;

    this.dbService.myData.subscribe(message => {
      console.log("11111111", this.sections)
      this.sections = this.dbService.data.sections;
      this.testimonials = this.dbService.data.testimonials;
      this.questions = this.dbService.data.questions;
      this.allOffers = this.dbService.data.allOffers;
      this.offers = this.dbService.data.offers;
      this.offersCats = this.dbService.data.offersCats;
      this.trend = this.dbService.data.trend;
      this.offSwiper = this.dbService.data.offSwiper;
      this.localizations = this.dbService.data.localizations;
      // this.dbService.appendJsFile();

      console.log("2222222222", this.sections)
    })
  }



  // ngAfterViewChecked(): void {
  //   try {
  //     if (this.fragment) {
  //       document?.querySelector('#' + this.fragment)?.scrollIntoView();
  //     }
  //   } catch (e) { }


  //   setTimeout(() => {
  //     let s = `new Swiper('.slides-3', {
  //     speed: 600,
  //     lazy: true, 
  //     loop: false,
  //     slidesPerView: 3,
  //     pagination: {
  //       el: '.swiper-pagination',
  //       type: 'bullets',
  //       clickable: true
  //     }
  //   });`;
  //     this.offSwiper = eval(s);
  //   }, 1000);


  //   setTimeout(() => {
  //     let offersCats: any = document.querySelectorAll("#event-flters li");
  //     for (const o of offersCats) {
  //       o.addEventListener('click', function () {
  //         for (const o of offersCats) {
  //           o.classList.remove('filter-active');
  //         }
  //         o.classList.add('filter-active');
  //       })
  //     }
  //   }, 500)


  // }


  // changeImages(cat_id: any) {
  //   this.offSwiper.destroy();
  //   let temp = [];
  //   if (cat_id == 'all') temp = this.allOffers;
  //   else {
  //     temp = [];
  //     for (let i = 0; i < this.allOffers.length; i++) {
  //       const element = this.allOffers[i];
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
  //   this.offSwiper = eval(xx);
  //   this.offers = temp;
  //   setTimeout(() => {
  //     this.offSwiper.destroy();
  //     this.offSwiper = eval(xx);

  //     let slides = document.querySelectorAll('.slides-3 .swiper-slide');
  //     for (let i = 0; i < slides.length; i++) {
  //       let s: any = slides[i];
  //       if (!s.style.backgroundImage) {
  //         s.style.backgroundImage = "url('" + this.offers[i].images.untitled[0].dir + this.offers[i].images.untitled[0].image + "')";
  //       }
  //     }
  //   }, 50);
  //   console.log("hiii", this.offers);
  // }

  transform(url: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  //   this.dbService.api('/batch', 'post', {
  //     requests: [
  //       {
  //         path: "/Testimonials",
  //         body: {
  //           fields: "Name,positionName,Text",
  //           limit: -1,
  //           locale: "En,Ar",
  //           media: "images"
  //         },
  //         method: "get",
  //       },
  //       {
  //         path: "/QnA",
  //         body: {
  //           fields: "Question,Answer",
  //           limit: -1,
  //           locale: "En,Ar",
  //         },
  //         method: "get",
  //       },
  //       {
  //         path: "/Sections",
  //         body: {
  //           fields: "Title,Section,Text,specs,Brief",
  //           limit: -1,
  //           locale: "En,Ar",
  //           media: "images"
  //         },
  //         method: "get",
  //       },
  //       {
  //         path: "/_Locale",
  //         body: {
  //           fields: "Key,En,Ar",
  //           limit: -1,
  //         },
  //         method: "get",
  //       },
  //       {
  //         path: "/Offers",
  //         body: {
  //           fields: "Title,categories,Text,Price",
  //           locale: "En,Ar",
  //           limit: -1,
  //           media: "images"
  //         },
  //         method: "get",
  //       },
  //       {
  //         path: "/Offers/categories",
  //         body: {},
  //         method: "get",
  //       },
  //       {
  //         path: "/Trend",
  //         body: {
  //           fields: "Title,Text",
  //           locale: "En,Ar",
  //           limit: -1,
  //           media: "images"
  //         },
  //         method: "get",
  //       }
  //     ]
  //   })
  //     .then(response => response.json())
  //     .then(data => {
  //       console.log('Success:', data);


  //       console.log('testimonials:', data);
  //       this.testimonials = data[0].results;


  //       console.log('questions:', data);
  //       this.questions = data[1].results;



  //       console.log('sections:', data[2]);
  //       this.sections = data[2].results;

  //       // Make specs Arabic and english
  //       for (let index = 0; index < Object.keys(this.sections).length; index++) {
  //         let key = Object.keys(this.sections)[index];
  //         let specs: any = {
  //           En: [],
  //           Ar: []
  //         };
  //         for (let i = 0; i < this.sections[key]?.specs?.length; i++) {
  //           if (this.sections[key].specs[i].Name.slice(-3) == '_en') {
  //             this.sections[key].specs[i].Name = this.sections[key].specs[i].Name.slice(0, -3);
  //             specs.En.push(this.sections[key].specs[i]);
  //           }
  //           else {
  //             specs.Ar.push(this.sections[key].specs[i]);
  //           }
  //         }
  //         this.sections[key].specs = specs;
  //       }

  //       // only in sections (array to object + localstorage)
  //       let obj = Object.assign(
  //         {},
  //         ...this.sections.map((x: any) => ({ [x.Section]: x }))
  //       );
  //       this.sections = obj;


  //       console.log("localstorage", this.sections);
  //       localStorage.setItem("sections", JSON.stringify(obj));

  //       console.log('localizations:', data[3]);
  //       this.localizations = data[3].results;

  //       // only in localizations (array to object + localstorage)
  //       obj = Object.assign(
  //         {},
  //         ...this.localizations.map((x: any) => ({ [x.Key]: x }))
  //       );
  //       this.localizations = obj;
  //       console.log('localizations:', this.localizations);
  //       localStorage.setItem("localizations", JSON.stringify(obj));


  //       this.allOffers = data[4].results;
  //       this.offers = data[4].results;
  //       console.log('allOffers', this.allOffers)

  //       setTimeout(() => {
  //         let s = `new Swiper('.slides-3', {
  //           speed: 600,
  //           lazy: true, 
  //           loop: false,
  //           slidesPerView: 3,
  //           pagination: {
  //             el: '.swiper-pagination',
  //             type: 'bullets',
  //             clickable: true
  //           }
  //         });`;
  //         this.offSwiper = eval(s);
  //       }, 1000);



  //       this.offersCats = data[5].results;
  //       console.log('offersCats', this.offersCats)
  //       // End

  //       console.log('Trend:', data[6]);
  //       this.trend = data[6].results;



  //       setTimeout(() => {
  //         let offersCats: any = document.querySelectorAll("#event-flters li");
  //         for (const o of offersCats) {
  //           o.addEventListener('click', function () {
  //             for (const o of offersCats) {
  //               o.classList.remove('filter-active');
  //             }
  //             o.classList.add('filter-active');
  //           })
  //         }
  //       }, 500)
  //     })
  //     .catch((error) => {
  //       console.error('Error:', error);
  //     });
  // }

  // ngOnChanges(changes: SimpleChanges) {
  //   console.log(changes);
  // }




  // changeImages(cat_id: any) {
  //   this.offSwiper.destroy();
  //   let temp = [];
  //   if (cat_id == 'all') temp = this.allOffers;
  //   else {
  //     temp = [];
  //     for (let i = 0; i < this.allOffers.length; i++) {
  //       const element = this.allOffers[i];
  //       if (element.categories[0].objectId == cat_id) {
  //         temp.push(element);
  //       }
  //     }
  //   }
  //   let xx = `new Swiper('.slides-3', {
  //     speed: 600,
  //     lazy: true,
  //     loop: false,
  //     autoplay: {
  //       delay: 5000,
  //       disableOnInteraction: true
  //     },
  //     slidesPerView: 'auto',
  //     pagination: {
  //       el: '.swiper-pagination',
  //       type: 'bullets',
  //       clickable: true
  //     },
  //     navigation: {
  //       nextEl: '.swiper-button-next',
  //       prevEl: '.swiper-button-prev',
  //     },
  //     breakpoints: {
  //       320: {
  //         slidesPerView: 1,
  //         spaceBetween: 40
  //       },

  //       1200: {
  //         slidesPerView: ${temp.length < 3 ? temp.length : 3},
  //       }
  //     }
  //   });`
  //   this.offSwiper = eval(xx);
  //   this.offers = temp;
  //   setTimeout(() => {
  //     this.offSwiper.destroy();
  //     this.offSwiper = eval(xx);

  //     let slides = document.querySelectorAll('.slides-3 .swiper-slide');
  //     for (let i = 0; i < slides.length; i++) {
  //       let s: any = slides[i];
  //       if (!s.style.backgroundImage) {
  //         s.style.backgroundImage = "url('" + this.offers[i].images.untitled[0].dir + this.offers[i].images.untitled[0].image + "')";
  //       }
  //     }
  //   }, 50);
  //   console.log("hiii", this.offers);
  // }

  // transform(url: any) {
  //   return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  // }






  // // functions related to cookies
  // setCookie(name: any, value: any, days: any) {
  //   var expires = "";
  //   if (days) {
  //     var date = new Date();
  //     date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  //     expires = "; expires=" + date.toUTCString();
  //   }
  //   document.cookie = name + "=" + (value || "") + expires + "; path=/";
  // }
  // getCookie(name: any) {
  //   var nameEQ = name + "=";
  //   var ca = document.cookie.split(';');
  //   for (var i = 0; i < ca.length; i++) {
  //     var c = ca[i];
  //     while (c.charAt(0) == ' ') c = c.substring(1, c.length);
  //     if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  //   }
  //   return null;
  // }
}


