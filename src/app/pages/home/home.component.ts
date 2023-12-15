import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ProductsService, Product } from 'src/app/services/products/products.service';
import { CategoryService, Category } from 'src/app/services/categories/category.service';
import { ToastrService } from 'ngx-toastr';
import { OrderService, CartItem } from 'src/app/services/order/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products: Product[] = [];
  currentPage = 1;
  categoryList: Category[] = [];
  cartItemList: CartItem[] = [];
  selectedCategory: number | undefined = undefined;
  searchInput: string | undefined = undefined;

  constructor(
    private productService: ProductsService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private orderService: OrderService,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadProducts(this.currentPage);
    this.categoryService.getCategoryList().subscribe(data => { this.categoryList = data });
  }

  loadProducts(page: number): void {
    let productObservable = this.productService.filterProductsList(page, this.searchInput, this.selectedCategory)

    productObservable.subscribe(data => {
        if (data.length > 0) {
            this.currentPage = page;
            this.products = this.products.concat(data).filter(product => product.status);
        }
    });
  }

  loadMore(): void {
    this.loadProducts(this.currentPage + 1);
  }

  loadProductsByCategory(): void {
    this.currentPage = 1;
    this.products = [];
    this.loadProducts(this.currentPage);
  }

  searchProducts(): void {
    this.products = [];
    this.loadProducts(this.currentPage);
  }

  async addToCart(productId: number, quantity: number): Promise<void> {
    await this.checkLogined();

    const cartItem: CartItem = { productId, quantity };

    this.orderService.addToCart(cartItem).subscribe(
      () => {
        this.toastr.success('Item added to the cart successfully', 'Success');
      },
      (error) => {
        console.error('Failed to add item to the cart', error);
        this.toastr.error(error.error, 'Error');
      }
    );
  }

  async getCart(): Promise<void> {
    await this.checkLogined();

    this.orderService.getCart().subscribe(
      (cartItems) => {
        console.log('User Cart:', cartItems);
        this.cartItemList = cartItems;
      },
      (error) => {
        console.error('Failed to retrieve user cart', error);
        // Handle the error, e.g., display a message to the user
      }
    );
  }

  async checkLogined(): Promise<void> {
    if (! await this.authService.checkLogined()) {
      this.router.navigate(['/login']);
      return;
    }
  }

}
