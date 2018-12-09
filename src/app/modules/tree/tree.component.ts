import { Component, OnInit } from '@angular/core';
import { AppService } from '../app-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit {

  constructor(private appService: AppService) { }

  ngOnInit() {
  }

  onClickBack(): void {
    console.log('route to home');
    this.appService.getHomePage();
  }

}
