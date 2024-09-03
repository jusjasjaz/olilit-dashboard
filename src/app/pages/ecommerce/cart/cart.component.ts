import { Component, OnInit } from '@angular/core';

import { Cart } from './cart.model';
import { cartData } from './data';

// Sweet Alert
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})

/**
 * Cart Component
 */
export class CartComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  cartData!: Cart[];

  constructor() { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Ecommerce' },
      { label: 'Shopping Cart', active: true }
    ];

    /**
     * fetches the data
     */
     this._fetchData();
  }

  /**
   * Cart data fetch
   */
   private _fetchData() {
    this.cartData = cartData;
  }

  // Default
  counter : any = 0;
  increment(id:any) {
    this.counter = (document.getElementById('cart-'+id) as HTMLInputElement).value;
    this.counter++;
    (document.getElementById('cart-'+id) as HTMLInputElement).value = this.counter;

  }
  
  decrement(id:any) {
    this.counter = (document.getElementById('cart-'+id) as HTMLInputElement).value;
    this.counter--;
    (document.getElementById('cart-'+id) as HTMLInputElement).value = this.counter;
  }

  /**
   * Confirmation mail model
   */
   confirm() {
    Swal.fire({
      title: 'Are you sure ?',
      text: 'Are you sure you want to remove this product ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Close'
    }).then(result => {
      if (result.value) {
        Swal.fire('Deleted!', 'Cart has been deleted.', 'success');
      }
    });
  }

}
