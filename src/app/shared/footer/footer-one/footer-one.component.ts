import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-footer-one',
  templateUrl: './footer-one.component.html',
  styleUrls: ['./footer-one.component.scss']
})
export class FooterOneComponent implements OnInit {

  company: any;

  constructor(private companyService: CompanyService) { }

  ngOnInit() {
    this.companyService.getCompanyProfile().subscribe(
      result => {
        this.company = result;
        // console.log(this.company);
      }
    );
  }

}
