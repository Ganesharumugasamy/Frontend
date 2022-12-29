import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { BackendService } from './backend.service';
import OrgChart from "src/assets/balkanapp/orgchart"
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'villagetalkies';
  posts: any;
  isReset:boolean;
  myControl = new FormControl();
  // options: any 
  filteredOptions: Observable<any[]>;
  chart;

  constructor(private service: BackendService) { }

  ngOnInit(): void {

    this.initialise(true);

  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.posts.filter(option => option.Name.toLowerCase().includes(filterValue));
  }

  displayChart(id) {
    this.isReset = true
    const tree = document.getElementById('tree');
    if (tree) {
      this.chart = new OrgChart(tree, {
        enableDragDrop: false,
        // layout: OrgChart.tree,
        nodeBinding: {
          field_0: "name",
          img_0: "img"
        },
      });


    this.chart.destroy()
    var data: Array<OrgChart.node> = []
    this.posts.forEach(ele => {
      if( ele.id == id )
      {
        var imeg = new String(`../assets/${ele.id}.jpg`)
        this.chart.addNode({ id: ele.id, name: ele.Name, title: ele.Designation, img: imeg });
      }
      else if (ele.ManagerId == id) 
      {
        var imeg = new String(`../assets/${ele.id}.jpg`)
        this.chart.addNode({ id: ele.id, pid: ele.ManagerId, name: ele.Name, title: ele.Designation, img: imeg });
      }
    })
    }
  }

  initialise(isinitialdada) {
    this.isReset = false
    if(this.chart) this.chart.destroy()
    if (isinitialdada == true) {
    this.service.getPosts().subscribe(response => {
      this.posts = response;
      // this.options = response;
      this.posts.forEach(person => {
        var imeg = new String(`../assets/${person.id}.jpg`)
        this.chart.addNode({ id: person.id, pid: person.ManagerId, name: person.Name, title: person.Designation, img: imeg });
      })
 
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => {
          const name = typeof value === 'string' ? value : value?.Name;
          return name ? this._filter(name as string) : this.posts ? this.posts.slice() : ""
        }),
      );
    });
  }
  else {
    setTimeout(() => {
    this.posts.forEach(person => {
      var imeg = new String(`../assets/${person.id}.jpg`)
      this.chart.addNode({ id: person.id, pid: person.ManagerId, name: person.Name, title: person.Designation, img: imeg });
    })
  },2000)
  }

    const tree = document.getElementById('tree');
    if (tree) {
      this.chart = new OrgChart(tree, {
        enableDragDrop: true,
        // layout: OrgChart.tree,
        nodeBinding: {
          field_0: "name",
          img_0: "img"
        },
      });

      this.chart.onDrop(e => {
        setTimeout(() => {
          this.posts.forEach(ele => {
            if (ele.ManagerId != this.chart.nodes[ele.id].pid) {
              ele.ManagerId = this.chart.nodes[ele.id].pid;
              ele.id = ele.id;
              for (var index in this.posts) {
                if (this.posts[index].id == this.chart.nodes[ele.id].pid) {
                  ele.Team = this.posts[index].Team;
                  ele.Manager = this.posts[index].Name
                  break;
                }
              }
              // this.service.addData(ele).subscribe(newData => {
              // });
            }
          })
        }, 2000)
      })

    }

  }

}


