import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss']
})

export class BasicComponent implements OnInit {

  email: any = '';

  constructor(
    public userService: UserService
  ) { }

  ngOnInit(): void {
 
  }

  resetPass(){
    if( !this.isEmail(this.email) ) {
      return;
    }

    this.userService.forgot_password(this.email).subscribe(
      async (data: any) => {
        let res = JSON.parse(data)
      },
      (err: any) => {
        console.log(err)
        // add toast here
      }
    )
  }

  isEmail(search:string):boolean {
    var  serchfind:boolean;
    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    serchfind = regexp.test(search);
    return serchfind
  }

}
