import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastService } from 'src/app/pages/dashboards/dashboard/toast-service';
import { PentestService } from 'src/app/services/pentest';
import { Crypt } from 'src/app/services/crypto-serve';
import { environment } from 'src/environments/environment'
import { TranslateService } from '@ngx-translate/core';

const { version: portalVersion } = require('../../../../package.json')

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login Component
 */


export class LoginComponent implements OnInit {


  // Login Form
  loginForm!: FormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = '';
  returnUrl!: string;

  toast!: false;

  // set the current year
  year: number = new Date().getFullYear();

  remember:boolean=false;
  email:any='';

  errorMesage: any = '';
  destination: any = '/dashboard';
  active_language: any = '';

  selectedLanguage:any;

  envTag: any = environment.tag;

  version: any = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public toastService: ToastService,
    private pentestService: PentestService,
    private crypto: Crypt,
    public translate: TranslateService, 
    ) {
      this.version = portalVersion;
    }

  ngOnInit(): void {
    /**
     * Form Validatyion
     */
     this.loginForm = this.formBuilder.group({
      email: [( localStorage.getItem('username') ? localStorage.getItem('username') : ''), [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('permission');

    if( !localStorage.getItem('remember') ) {
      localStorage.removeItem('username');
    } else {
      this.remember = true;
    }

    this.get_token();
    this.setLang(localStorage.getItem('activeLanguage') ? localStorage.getItem('activeLanguage') : 'en');
  }

  setLang(type:any) {
    this.translate.use(type);
    localStorage.setItem('activeLanguage', type);
    this.active_language = type;
  }

  get_token(){
    this.pentestService.get_token().subscribe(
      async (data: any) => {
        let res = JSON.parse(data);
        localStorage.setItem("iv",res['data'][0]['iv']);
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

   onSubmit() {
    let pages = {
      'Dashboard' : '/dashboard',
      'Customers' : '/customers-page',
      'Merchants' : '/merchants-page',
      'User Management' : '/user-management',
      'Fee Configuration' : '/fee-configuration',
      'Limit Configuration' : '/limit-configuration',
      'Help Ticket' : '/help-tickets',
      'Notification Template' : '/notification-template'
    };
    this.submitted = true;
    if (this.loginForm.invalid) { // stop here if form is invalid
      return;
    } else {
      let postParams = {
        "Service":"auth",
        "Method":"login",
        "Username": this.f['email'].value,
        "Password": this.f['password'].value
      };
      let encrypted_data = this.crypto.encryptJson(postParams, environment.apiKey, localStorage.getItem('iv'));
      this.pentestService.request(encrypted_data).subscribe(
        async (data: any) => {
          let res = this.crypto.decryptJson(data, environment.apiKey, localStorage.getItem('iv'));
          if( res['isSuccess'] == true ) {
            // check permission
            let perms = res['data'].programsPermissions[0]['modules'];
            if( perms.length == 0 ) {
              this.errorMesage = 'Your account does not have any permissions';
              return;
            } else {
              let hasDashboard = false;
              perms.map((key:any)=>{
                if( key.moduleDescription == 'Dashboard' && key.rolePermissions ){
                  hasDashboard = true;
                }
              })
              if( !hasDashboard ) this.destination = pages[perms[0]['moduleDescription'] as keyof typeof pages]
            }

            // pass through
            localStorage.setItem('token', res['data']['sessionId']);
            localStorage.setItem('permission', JSON.stringify(res['data'].programsPermissions[0]['modules']));

            let dt = {
              firstName : res['data']['firstName'],
              lastName : res['data']['lastName'],
              portal: 'admin'
            }
            localStorage.setItem('userInfo', JSON.stringify(dt));

            if( this.remember ) {
              localStorage.setItem('username', this.f['email'].value);
              localStorage.setItem('remember', 'true');
            } else {
              localStorage.removeItem('remember');
              localStorage.removeItem('username');
            }
            
            this.router.navigate([this.destination]);
          } else {
            this.errorMesage = (res.message ? res.message : res.Message);
          }

        },
        (err: any) => {
          console.log(err)
          // add toast here
        }
      )

    }
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  signUp() {
    // Directly navigate to the dashboard without any checks or processing
    this.router.navigate(['/auth/sign-up']);
  }
}
