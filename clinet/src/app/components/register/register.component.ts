import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service'
import {Router} from '@angular/router'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  message;
  messageClass;
  processing=false;
  emailValid;
  emailMessage;
  usernameValid;
  usernameMessage;

  constructor(private formBuilder:FormBuilder,
  private authService: AuthService,
  private router:Router) {
    this.createForm()
    //this.form.controls['username'].disable();
   }

  createForm(){
    this.form = this.formBuilder.group({
      email:['',Validators.compose([Validators.required,
      Validators.minLength(5),
      Validators.maxLength(30),
      this.validateEmail
    ])],
      username:['',Validators.compose([Validators.required,
      Validators.minLength(5),
      Validators.maxLength(30)
    ])],
    profession:['',Validators.compose([Validators.required
    ])],
    fname:['',Validators.compose([Validators.required
    ])],
    lname:['',Validators.compose([Validators.required
    ])],
    bday:['',Validators.compose([Validators.required
    ])],
    address:['',Validators.compose([Validators.required
    ])],
    country:['',Validators.compose([Validators.required
    ])],
    state:['',Validators.compose([Validators.required
    ])],
    zip:['',Validators.compose([Validators.required
    ])],
      password:['',Validators.compose([Validators.required,
      Validators.minLength(5),
      Validators.maxLength(30)
    ])],
    confirm:['',Validators.required]
  }, {validator: this.matchingPasswords('password','confirm')});
  }

  disableForm(){
    this.form.controls['email'].disable();
    this.form.controls['username'].disable();
    this.form.controls['confirm'].disable();
    this.form.controls['password'].disable();
    this.form.controls['profession'].disable();
    this.form.controls['fname'].disable();
    this.form.controls['lname'].disable();
    this.form.controls['bday'].disable();
    this.form.controls['address'].disable();
    this.form.controls['country'].disable();
    this.form.controls['state'].disable();
    this.form.controls['zip'].disable();
  }
  enableForm(){
    this.form.controls['email'].enable();
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
    this.form.controls['confirm'].enable();
    this.form.controls['profession'].enable();
    this.form.controls['fname'].enable();
    this.form.controls['lname'].enable();
    this.form.controls['bday'].enable();
    this.form.controls['address'].enable();
    this.form.controls['country'].enable();
    this.form.controls['state'].enable();
    this.form.controls['zip'].enable();
  }

  validateEmail(controls){
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if(regExp.test(controls.value)){
      return null
    }else{
      return {'validateEmail': true}
    }

  }
  matchingPasswords(password,confirm){
    return (group: FormGroup)=>{
      if (group.controls[password].value === group.controls[confirm].value){
        return null
      }else{
        return {'matchingPasswords':true }
      }
    }
  }

  onRegisterSubmit(){

    this.processing = true;
    this.disableForm();

    const user = {
      username: this.form.get('username').value,
      password: this.form.get('password').value,
      email: this.form.get('email').value,
      fname: this.form.get('fname').value,
      lname: this.form.get('lname').value,
      bday: this.form.get('bday').value,
      profession: this.form.get('profession').value,
      country: this.form.get('country').value,
      state: this.form.get('state').value,
      zip: this.form.get('zip').value,
      address: this.form.get('address').value
    }
    this.authService.registerUser(user).subscribe(data=>{

      if(data.status){
        this.messageClass = 'alert alert-success'
        this.message=data.message
        setTimeout(()=>{
          this.router.navigate(['/login'])
        },2000)

      }else{
        this.messageClass = 'alert alert-danger'
        this.message=data.message
        this.processing = false;
        this.enableForm();
      }

    })
  }

  checkEmail(){
    this.authService.checkEmail(this.form.get('email').value).subscribe(data=>{
      if(!data.success){
        this.emailValid = false;
        this.emailMessage = data.message;
      }else{
        this.emailValid = true;
        this.emailMessage = data.message;
      }
    })
  }
  checkUsername(){
    this.authService.checkUsername(this.form.get('username').value).subscribe(data=>{
      if(!data.success){
        this.usernameValid = false;
        this.usernameMessage = data.message;
      }else{
        this.usernameValid = true;
        this.usernameMessage = data.message;
      }
    })
  }

  ngOnInit() {
  }

}
