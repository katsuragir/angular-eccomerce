import { Component, OnInit } from '@angular/core';
import { Category } from '../../../../shared/classes/category';
import { CategoryService } from '../../../../shared/services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  public categories: Category[] = [];

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.categoryService.getCategories().subscribe(category => {
      this.categories = category.filter(x => x.id_parent === 1);
      // console.log(this.categories);
    });
  }

}
