import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
  allItems = 'First/Last :Items';
  @Input()
  length!: number;
  @Input() limit!: number;
  @Input()
  pageSize!: number;
  @Input()
  isPaginatorDiabled!:boolean;
  @Output() pageChanged = new EventEmitter<PageEvent>();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  handlePage(event: PageEvent): void {

    this.pageChanged.emit(event);

  }

  goToFirst(): void {

    this.paginator.firstPage();
    this.pageChanged.emit({ pageIndex: 0, pageSize: this.pageSize, length: this.length });

  }

  goToLast(): void {

    const lastIndex = Math.ceil(this.length / this.pageSize) - 1;
    this.paginator.pageIndex = lastIndex;
    this.pageChanged.emit({ pageIndex: lastIndex, pageSize: this.pageSize, length: this.length });

  }

}
