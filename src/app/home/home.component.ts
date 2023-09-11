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

    if (this.myForm.invalid) {
      Object.values(this.myForm.controls).forEach((control: AbstractControl) => {
        control.markAsTouched();
      });
    } else {
      // Collect form data
      const formData = this.myForm.value;

      // Call the sendEmail function from the DatabaseService with the form data
      this.dbService.sendEmail(formData).subscribe(
        (response) => {
          console.log('Email sent successfully', response);
          // Handle success, e.g., show a success message to the user
        },
        (error) => {
          console.error('Error sending email', error);
          // Handle error, e.g., show an error message to the user
        }
      );
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


  transform(url: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}


