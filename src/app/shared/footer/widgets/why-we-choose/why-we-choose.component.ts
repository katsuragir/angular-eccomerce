import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-why-we-choose',
  templateUrl: './why-we-choose.component.html',
  styleUrls: ['./why-we-choose.component.scss']
})
export class WhyWeChooseComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  gotoDashboard() {
    const params = 'confirm';
    this.router.navigate(['/pages/dashboard', params], { relativeTo: this.activatedRoute });
  }

}
