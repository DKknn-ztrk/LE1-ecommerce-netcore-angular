import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';
import { IOrder } from 'src/app/shared/models/order';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements OnInit {
  @Input() checkoutForm: FormGroup;
  // @ViewChild('cardNumber', { static: true }) cardNumberElement: ElementRef;
  // @ViewChild('cardExpiry', { static: true }) cardExpiryElement: ElementRef;
  // @ViewChild('cardCvc', { static: true }) cardCvcElement: ElementRef;
  // stripe: any;
  // cardNumber: any;
  // cardExpiry: any;
  // cardCvc: any;
  // cardErrors: any;
  // cardHandler = this.onChange.bind(this);
  // loading = false;
  // cardNumberValid = false;
  // cardExpiryValid = false;
  // cardCvcValid = false;

  constructor(
    private basketService: BasketService, 
    private checkoutService: CheckoutService,
    private toastr: ToastrService, 
    private router: Router) { }

  ngOnInit(): void {
  }

  async submitOrder() {
    // this.loading = true;
    const basket = this.basketService.getCurrentBasketValue();
    const orderToCreate = this.getOrderToCreate(basket);
    this.checkoutService.createOrder(orderToCreate).subscribe((order: IOrder) => {
      this.toastr.success('Order created successfully.');
      this.basketService.deleteLocalBasket(basket.id);
      const navigationExtras: NavigationExtras = {state: order};
      this.router.navigate(['checkout/success'], navigationExtras);
      console.log(order);
    }, error => {
      this.toastr.error(error.message);
      console.log(error);
    });
  }

  private getOrderToCreate(basket: IBasket) {
    return {
      basketId: basket.id,
      deliveryMethodId: +this.checkoutForm.get('deliveryForm').get('deliveryMethod').value,
      shipToAddress: this.checkoutForm.get('addressForm').value
    };
  }

}
