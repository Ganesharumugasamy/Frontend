import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import {BackendService} from '../backend.service'
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { anotherPost } from './interface';


@Component({
  selector: 'app-leftside',
  templateUrl: './leftside.component.html',
  styleUrls: ['./leftside.component.css']
})
export class LeftsideComponent implements OnInit{
  posts:any;
  searchOpt:any;

  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  //allPosts: anotherPost[];
  autoCompleteList: any[]

  @ViewChild('autocompleteInput') autocompleteInput: ElementRef;
  @Output() onSelectedOption:any = new EventEmitter<any>();
  
  constructor (private service:BackendService){}

  ngOnInit(): void {
    this.service.getPosts().subscribe(response => {
      this.posts = response;
      //this.allPosts = response; // just copied twice in different variables
    })
    // when user types something in input, the value changes will come through this
    this.myControl.valueChanges.subscribe(userInput => {
    this.autoCompleteExpenseList(userInput);
    })
    this.searchOpt = this.service.searchOption;
  }

  private autoCompleteExpenseList(input) {
    let categoryList = this.filterCategoryList(input)
    this.autoCompleteList = categoryList;
  }   

    // this is where filtering the data happens according to you typed value
  filterCategoryList(val) {
      var categoryList = []
      if (typeof val != "string") {
          return [];
      }
      if (val === '' || val === null) {
          return [];
      }
      return val ? this.posts.filter(s => s.Name.toLowerCase().indexOf(val.toLowerCase()) != -1)
          : this.posts;
  }  

    displayFn(post: any) {
        let k = post ? post.Name : post;
        return k;
    }

    filterPostList(event) {
      var filterposts = event.source.value;
      if (!filterposts) {
          this.service.searchOption = []
      }
      else {

          this.service.searchOption.push(filterposts);
          this.onSelectedOption.emit(this.service.searchOption)
      }
      this.focusOnPlaceInput();
  }    
  removeOption(option) {

    let index = this.service.searchOption.indexOf(option);
    if (index >= 0)
        this.service.searchOption.splice(index, 1);
    this.focusOnPlaceInput();

    this.onSelectedOption.emit(this.service.searchOption)
  }

// focus the input field and remove any unwanted text.
focusOnPlaceInput() {
    this.autocompleteInput.nativeElement.focus();
    this.autocompleteInput.nativeElement.value = '';
}

onSelectedFilter(e) {
  this.getFilteredExpenseList();
}

getFilteredExpenseList() {
  if (this.service.searchOption.length > 0)
    this.posts = this.service.filteredListOptions();
  else {
    this.posts = this.service.postsData;
  }

}
  // this.onSelectedOption.emit(this.service.searchOption)
  
}
