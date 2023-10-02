import { Component, OnInit, Pipe, PipeTransform, SimpleChanges } from '@angular/core';
import { DatabaseService } from './../database.service';
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'co-profile',
  templateUrl: './co-profile.component.html',
  styleUrls: ['./co-profile.component.css']
})
export class CoProfileComponent implements OnInit {



  // Properties for profile-overview section
  overviewuser: string = 'Kevin Anderson';
  // overviewAbout: string = 'Sunt est soluta temporibus accusantium...';
  overviewCompany: string = 'tech';
  overviewManagerName: string = 'John Doe';
  overviewNumber: number = 12345;
  overviewEmail: string = 'john@example.com';
  overviewCR: string = 'CR123456';
  overviewVATNumber: string = '7890';
  // overviewPassword: number = '1232232'
  overviewBalance: number = 5000;

  currentPassword: string = '';
  newPassword: string = '';
  renewPassword: string = '';
  currentPasswordError: boolean = false;
  // Method to save changes
  saveChanges() {

    if (this.profileEditForm.valid) {
      // this.overviewAbout = this.profileEditForm.value.about;
      this.overviewCompany = this.profileEditForm.value.company;
      this.overviewManagerName = this.profileEditForm.value.managerName;
      this.overviewNumber = this.profileEditForm.value.number;
      this.overviewEmail = this.profileEditForm.value.email;
      this.overviewCR = this.profileEditForm.value.cr;
      this.overviewVATNumber = this.profileEditForm.value.vatNumber;
      // this.overviewPassword = this.profileEditForm.value.password;
      this.overviewBalance = this.profileEditForm.value.balance;
    }
  }

  // Property to track whether to show password
  showPassword: boolean = false;

  // Method to get the input type for password
  getPasswordInputType() {
    return this.showPassword ? 'text' : 'password';
  }

  // Method to handle password change
  changePassword() {
    this.currentPasswordError = false;

    // Check if the current password is empty
    if (!this.currentPassword || this.currentPassword.trim() === '') {
      this.currentPasswordError = true;
      return;
    }

    // Replace 'expectedCurrentPassword' with the actual user's current password (from the backend)
    // This step requires backend integration to check the current password
    const expectedCurrentPassword = '123';

    // Check if the current password is correct
    if (this.currentPassword !== expectedCurrentPassword) {
      this.currentPasswordError = true;
      return;
    }

    // Check if the new password and re-entered new password match
    if (this.newPassword !== this.renewPassword) {
      return;
    }

    // Implement password change logic (e.g., call a backend API) here

    this.currentPassword = '';
    this.newPassword = '';
    this.renewPassword = '';
  }

  profileEditForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private sanitizer: DomSanitizer, private dbService: DatabaseService, private route: ActivatedRoute) {
    this.profileEditForm = this.formBuilder.group({
      // about: [this.overviewAbout, Validators.required],
      company: [this.overviewCompany, Validators.required],
      managerName: [this.overviewManagerName, Validators.required],
      number: [this.overviewNumber, Validators.required],
      email: [this.overviewEmail, [Validators.required, Validators.email]],
      cr: [this.overviewCR, Validators.required],
      vatNumber: [this.overviewVATNumber, Validators.required],
      // password: [this.overviewPassword, Validators.required],
      balance: [this.overviewBalance],
    });

  }


  companies: any = [];
  localizations: any = [];
  fragment: any;

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

    this.dbService.myData.subscribe((data) => {
      this.overviewuser = this.dbService.data.companies[0].userName.value;
      this.overviewCompany = this.dbService.data.companies[0].Name.value;
      this.overviewManagerName = this.dbService.data.companies[0].Manager;
      this.overviewNumber = this.dbService.data.companies[0].Number;
      this.overviewEmail = this.dbService.data.companies[0].Email;
      this.overviewCR = this.dbService.data[7].CR;
      this.overviewVATNumber = this.dbService.data.companies[0].VATNb;
      // this.overviewPassword = this.dbService.data.companies[0].Password;
      this.overviewBalance = this.dbService.data.companies[0].Balance;

    });

    eval("$('#preloader').show()")

    this.dbService.changeLanguage();
    // this.dbService.appendJsFile();
    this.route.fragment.subscribe((fragment: any) => { this.fragment = fragment; });

    this.companies = this.dbService.data.companies;
    this.localizations = this.dbService.data.localizations;
    console.log('coco:', this.companies);


    this.dbService.myData.subscribe(message => {
      this.companies = this.dbService.data.companies;
      this.localizations = this.dbService.data.localizations;
      // this.dbService.appendJsFile();
      console.log('coco:', this.companies);

    })
  }


  transform(url: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}