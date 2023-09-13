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
      travelersNumber: ['', Validators.required],
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
    if (this.submitted) {
      return; // Prevent multiple submissions
    }
    this.submitted = true;

    if (this.myForm.invalid) {
      Object.values(this.myForm.controls).forEach((control: AbstractControl) => {
        control.markAsTouched();
      });
      this.submitted = false; // Re-enable the submit button
      return;

    } else {

      // Collect form data
      const formData = this.myForm.value;

      // Disable the submit button
      const submitButton = document.getElementById('submit-button');
      if (submitButton) {
        submitButton.setAttribute('disabled', 'true');
      }


      // Call the sendEmail function from the DatabaseService with the form data
      this.dbService.sendEmail(formData).subscribe(
        (response) => {
          // Reset the form
          const ticketTypeValue = this.myForm.get('ticketType')?.value;
          this.showSuccessMessage();
          this.myForm.reset();
          this.myForm.get('ticketType')?.setValue(ticketTypeValue);
          this.submitted = false;
          if (submitButton) {
            submitButton.removeAttribute('disabled');
          }

          // Handle success, e.g., show a success message to the user

        },
        (error) => {
          console.error('Error sending email', error);
          this.ErrorMessage();
          // Re-enable the submit button immediately in case of an error
          if (submitButton) {
            submitButton.removeAttribute('disabled');
          }

        }
      );
    }
  }

  showSuccessMessage() {
    // Create a styled success message
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.textContent = 'Email sent successfully';
    document.body.appendChild(toast);

    // Remove the toast notification after a few seconds (adjust as needed)
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 4000);
  }


  ErrorMessage() {
    // Create a styled success message
    const toast = document.createElement('div');

    toast.className = 'toast show';
    toast.textContent = 'Error sending email, try again';
    this.submitted = false;
  }




  onSubmit2() {

    if (this.submitted) {
      return; // Prevent multiple submissions
    }

    this.submitted = true;

    if (this.contactForm.invalid) {
      // Mark all form controls as touched to trigger validation messages
      Object.values(this.contactForm.controls).forEach((control: AbstractControl) => {
        control.markAsTouched();
      });
      this.submitted = false; // Re-enable the submit button
      return;

    }
    else {
      // Collect form data
      const formData2 = this.contactForm.value;
      // Disable the submit button
      const submitButton = document.getElementById('submit-button');
      if (submitButton) {
        submitButton.setAttribute('disabled', 'true');
      }

      // Call the sendEmail function from the DatabaseService with the form data
      this.dbService.sendEmail2(formData2).subscribe(
        (response) => {
          console.log('Email sent successfully', response);
          // Handle success, e.g., show a success message to the user
          this.showSuccessMessage();
          this.contactForm.reset();
          this.submitted = false;

          // Re-enable the submit button
          if (submitButton) {
            submitButton.removeAttribute('disabled');
          }

        },
        (error) => {
          console.error('Error sending email', error);
          this.ErrorMessage();
          // Re-enable the submit button immediately in case of an error
          if (submitButton) {
            submitButton.removeAttribute('disabled');
          }
        }
      );
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


