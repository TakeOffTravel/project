import { Injectable, SimpleChanges } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {
    this.getSections();
  }

  changeData(obj: any) {
    this.allData.next(obj)
  }

  api(path: String, method: String, obj: any): Promise<Response> {
    let p = 'https://www.beaapis.com:29473/1' + path;
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



        this.data.offersCats = data[5].results;

        this.data.trend = data[6].results;

        this.changeData(this.data);

        setTimeout(() => {
          this.appendJsFile();
          setTimeout(() => {
            eval("$('#preloader').hide()")
          }, 500)
        }, 500)

      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  sendEmail(formData: any): Observable<any> {
    return new Observable((observer) => {
      console.log("SENDING EMAIL");

      this.api('/_Emails', 'GET', {
        "where": {
          "Username": "info@gythan.com"
        },
        "fields": "Username,IncomingMS,OutgoingMS,IMAPPort,POP3,SMTP,Password"
      })
        .then(p => p.json())
        .then(res => {
          console.log('Sent:', res);
          let d = {
            "token": res.results[0].token,
            "to": [
              {
                "name": "TakeOff",
                "email": "ahmadadra28@gmail.com"
              }
            ],
            "body": this.constructEmailBody(formData),
            "altbody": "Alt Body",
            "subject": "Testing Subject",
            "sender": "TakeOff",
            "priority": 1,
            "replyto": [
              {
                "name": "TakeOff",
                "email": "ahmadadra28@gmail.com"
              }
            ]
          }

          console.log("BEFORE SENDING", d);

          this.api("/_Emails/send", "POST", d)
            .then(p => p.json())
            .then(response => {
              console.log('BEFORE EMail:', response.results[0]);
              // Assuming your API response contains data you want to emit
              observer.next(response);
              observer.complete();
            })
            .catch(error => {
              observer.error(error);
            });
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  private constructEmailBody(formData: any): string {
    // Create an HTML email body with form field values
    const body = `
      <div>
        <p>Name: ${formData.name}</p>
        <p>Email: ${formData.email}</p>
        <p>Phone: ${formData.phone}</p>
        <p>From: ${formData.from}</p>
        <p>To: ${formData.to}</p>
        <p>Ticket Type: ${formData.ticketType}</p>
        <p>Number of Travelers: ${formData.travelersNumber}</p>
        <p>Date of Travel: ${formData.travelDate}</p>
        <p>Return Date: ${formData.returnDate}</p>
        <p>Added Services: ${formData.car ? 'Car' : ''} ${formData.visa ? 'Visa' : ''} ${formData.hotel ? 'Hotel' : ''}</p>
        <p>Hotel Name: ${formData.hotelName}</p>
        <p>Message: ${formData.message}</p>
      </div>
    `;

    return body;
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





