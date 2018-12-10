import { Component, OnInit } from '@angular/core';
import { AppService } from '../app-service.service';
import { IServerResponse } from '../../shared/server-response';

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
      // HACK: There should be a way for the AppService to get the response body.
      const castResponse = <IServerResponse> (res as any);
      this.appService.getTreePage(castResponse.message);
    });
  }

}
