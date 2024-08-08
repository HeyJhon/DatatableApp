import { Component, OnInit, ViewChild } from '@angular/core';
import { PostService } from '../../services/post.service';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import { PostModel } from '../../models/postmodel.interface';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {Sort, MatSortModule} from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {

  listPost!:PostModel[];
  displayedColumns: string[] = ['userId', 'id', 'title', 'body'];
  listPostDataSource = new MatTableDataSource<PostModel>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  searchText:string="";
  timeout:any;

  constructor(private _postService:PostService){}

  ngOnInit(): void {
    this.getAllPosts();
  }

  getAllPosts(){
    this._postService.getAllPost().subscribe({
      next:(res)=>{
        console.log(res);
        this.listPost = res;
        this.feedDataSource(res);
      },
      error:(err)=>{
        console.error(err);
      }
    })
  }
  
  feedDataSource(data:PostModel[]){
    this.listPostDataSource = new MatTableDataSource<PostModel>(data);
    this.listPostDataSource.paginator = this.paginator;
  }

  sortData(sort: Sort) {
    console.log(sort);

    const data = this.listPost.slice();
    if (!sort.active || sort.direction === '') {
      this.feedDataSource(data);
      return;
    }

    const sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id':
          return compare(a.id, b.id, isAsc);
        case 'title':
          return compare(a.title, b.title, isAsc);        
        default:
          return 0;
      }
    });

    this.feedDataSource(sortedData);

  }

  onInputChange(){
    //console.log('buscar', this.searchText);
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.filterData();
    }, 300);
  }

  filterData(){
    const search = this.searchText;
    const data = this.listPost.slice();
    if(!search){
      this.feedDataSource(data);
      return;
    }

    const dataFiltered = data.filter(item=>{
      return item.title.includes(search);
    });

    this.feedDataSource(dataFiltered);
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}