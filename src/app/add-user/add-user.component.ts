import { Component, OnInit, Pipe, PipeTransform, SimpleChanges } from '@angular/core';
import { DatabaseService } from './../database.service';
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  profileEditForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private sanitizer: DomSanitizer, private dbService: DatabaseService, private route: ActivatedRoute) {
    this.profileEditForm = this.formBuilder.group({
      // about: [this.overviewAbout, Validators.required],
      userName: ["", Validators.required],
      password: ["", Validators.required],
      company: ["", Validators.required],
      managerName: [""],
      number: [""],
      email: [""],
      cr: [""],
      vatNumber: [""],
      balance: [""],
    });

  }
  ngOnInit(): void {
  }

}
