import { Component, OnInit } from '@angular/core';
import { AppService } from '../app-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  title = 'Dependency Tree';
  inputString = '';

  constructor(private appService: AppService) { }

  ngOnInit() {
  }

  onClickGo(): void {
    console.log('route to tree');
    this.appService.onClickSubmit(this.inputString).subscribe(res => {
      this.appService.getTreePage();
    });
  }

}
