import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private dbService: DatabaseService) { }

  ngOnInit(): void {

    // this.dbService.api('/Users', 'POST', {
    //   Email: "ahamdqsd1s@dashli.com",
    //   firstName: "Huzaifa",
    //   lastName: "Kab"
    // }).then(response => response.json())
    //   .then(data => {
    //     console.log('Success:', data);
    //     if (data.results[0].error) {
    //       alert(data.results[0].error)
    //     } else {
    //       alert("Success");

    //       this.dbService.api('/Privileges', 'POST', {
    //         User: data.results[0].objectId,
    //         Type: "COMPANY",
    //       }).then(response => response.json())
    //         .then(data => {
    //           console.log('Success:', data);
    //           if (data.results[0].error) {
    //             alert(data.results[0].error)
    //           } else {
    //             alert("Success");
    //           }
    //         })

    //     }
    //   })


    // Include information of some pointer column

    // this.dbService.api('/Privileges', 'GET', {
    //   fields: "User,Type",
    // include: {
    //   className: "Users",
    //   field: "User",
    //   fields: "Email,firstName,lastName",
    // }
    // }).then(response => response.json())
    //   .then(data => {
    //     console.log('Success:', data);
    //   })


    // Reverse include

    // this.dbService.api('/Users', 'GET', {
    //   fields: "Email,firstName,lastName",
    //   where: {
    //     Email: "ahmad@gmail.com",
    //     Password: "1234"
    //   },
    //   include: {
    //     className: "Privileges",
    //     field: "User",
    //     fields: "User,Type",
    //     reverse: true
    //   }
    // }).then(response => response.json())
    //   .then(data => {
    //     console.log('Success:', data);
    //     if (data.results.length) {
    //       alert("Success")
    //     } else {
    //       alert("Username or password is invalid")
    //     }
    //   })




  }

}
