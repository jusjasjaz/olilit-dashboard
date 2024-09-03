import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Sweet Alert
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})

/**
 * Checkout Component
 */
export class CheckoutComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  submitted = false;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Ecommerce' },
      { label: 'Checkout', active: true }
    ];
  }

  /**
   * Confirmation mail model
   */
   confirm() {
    Swal.fire({
      title: 'Are you Sure ?',
      text: 'Are you Sure You want to Remove this Address ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Close'
    }).then(result => {
      if (result.value) {
        Swal.fire('Deleted!', 'Mail has been deleted.', 'success');
      }
    });
  }


   /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.submitted = false;
    this.modalService.open(content, { size: 'md', centered: true });
  }

}
