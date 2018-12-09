import { Component, OnInit } from '@angular/core';
import { AppService } from '../app-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  title = 'Dependency Tree';
  inputString = '';
  data;

  constructor(
    private appService: AppService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onClickGo(): void {
    console.log('route to tree');
    this.appService.onClickSubmit(this.inputString).subscribe(res => {
      this.data = res;
      console.log(this.data);
      this.router.navigate(['tree']);
    });
  }

}
