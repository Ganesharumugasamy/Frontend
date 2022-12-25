import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { BackendService } from './backend.service';
import OrgChart from "src/assets/balkanapp/orgchart"
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'villagetalkies';
  posts:any;
  searchOpt:any;
  selectedEmp:any;
  test:any
  myControl = new FormControl();
  // filteredOptions: Observable<string[]>;
  //allPosts: anotherPost[];
  options: any //= [{name: 'Mary'}, {name: 'Shelley'}, {name: 'Igor'}];
  filteredOptions: Observable<any[]>;

  autoCompleteList: any[]

  @ViewChild('autocompleteInput') autocompleteInput: ElementRef;
  @Output() onSelectedOption:any = new EventEmitter<any>();
  
  constructor (private service:BackendService){}

  ngOnInit(): void {
    // when user types something in input, the value changes will come through this
    this.service.getPosts().subscribe(response => {
      this.posts = response;
      this.options = response;
      console.log(this.posts)
      // console.log("TRAP4")
      this.posts.forEach( person => {
        var imeg = new String(`../assets/${person.id}.jpg`)
        chart.addNode({id : person.id, pid: person.ManagerId, name: person.Name, title: person.Designation, img: imeg});
      })
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => {
          const name = typeof value === 'string' ? value : value?.Name;
          return name ? this._filter(name as string) : this.options ? this.options.slice(): ""
        }),
      );
    });

    this.myControl.valueChanges.subscribe(userInput => {
      this.autoCompleteExpenseList(userInput);
      })
      this.searchOpt = this.service.searchOption;


    const tree = document.getElementById('tree');
    if (tree) {
        var chart = new OrgChart(tree, {
            enableDragDrop: true,
            nodeBinding: {
            field_0: "name",
            img_0: "img"
            },
        });

        chart.onDrop(e => {
          console.info(chart, 'chart')
          setTimeout( () => {
            this.posts.forEach( ele => {
              if(ele.ManagerId != chart.nodes[ele.id].pid)
              {
                ele.ManagerId = chart.nodes[ele.id].pid;
                ele.id = ele.id;
                for(var index in this.posts)
                {
                  if(this.posts[index].id == chart.nodes[ele.id].pid)
                  {
                    console.info("RAMK", this.posts[index].id, this.posts[index].Team, chart.nodes[ele.id].pid)
                    ele.Team = this.posts[index].Team;
                    ele.Manager = this.posts[index].Name
                    break;
                  }
                }
                this.service.addData(ele).subscribe(newData => {
                  // console.info('this.posts', newData)
                  });

              }
            })
          },5000)
          // chart.exportJSON('updated.json')
        })

      //   chart.on('drop', (sender, draggedNodeId, droppedNodeId) => {
      //     console.info('sender, draggedNodeId, droppedNodeId', sender, draggedNodeId, droppedNodeId);
      //     if (draggedNodeId == 1){
      //         return false;
      //     }
  
      //     if (droppedNodeId == 4){
      //         return false;
      //     }
      // });

    }

    // ngAfterViewInit(){
      // newData:anotherPosts;
  //     this.service.addData(newData).subscribe(newData => this.data.update(newData));
      
    // }
  }

  displayFn(user: any): string {
    return user && user.Name ? user.Name : '';
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.Name.toLowerCase().includes(filterValue));
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

    // displayFn(post: any) {
    //     let k = post ? post.Name : post;
    //     return k;
    // }

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

  
}

