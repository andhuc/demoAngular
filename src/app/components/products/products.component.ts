import { Component, OnInit } from '@angular/core';
import { ProductsService, Product } from 'src/app/services/products/products.service';
import { CategoryService, Category } from 'src/app/services/categories/category.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  currentPage = 1; // You can set the initial page here
  editedProduct: Product = { productId: 0, productName: '', price: 0, category: '', updatedAt: null, createdAt: null, categoryId: 0 , status: true};
  addedProduct: Product = { productId: 0, productName: '', price: 0, category: '', updatedAt: null, createdAt: null, categoryId: 0 , status: true};
  categoryList: Category[] = [];

  constructor(private productService: ProductsService, private categoryService: CategoryService, private authService: AuthService, private toastr: ToastrService) {
    this.categoryService.getCategoryList().subscribe(data => { this.categoryList = data })
  }

  ngOnInit(): void {
    this.loadProducts(this.currentPage);
  }

  loadProducts(page: number): void {
    this.productService.getProductsList(page).subscribe(data => {
      if (data.length > 0) {
        this.currentPage = page;
        this.products = data;
      }
    });
  }

  nextPage(): void {
    this.loadProducts(this.currentPage + 1);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.loadProducts(this.currentPage - 1);
    }
  }

  openEditModal(product: Product): void {
    this.editedProduct = { ...product };
  }

  saveChanges(): void {
    // Convert status to boolean
    this.editedProduct.status = this.editedProduct.status === 'true';

    this.productService.updateProduct(this.editedProduct).subscribe(
      () => {
        this.toastr.success('Product updated successfully', 'Success');
        this.loadProducts(this.currentPage);
      },
      (error) => {
        console.log(error)
        this.toastr.error(error.error, 'Error');
      }
    );
  }

  addProduct(): void {
    this.productService.addProduct(this.addedProduct).subscribe(
      () => {
        this.toastr.success('Product added successfully', 'Success');
        this.loadProducts(this.currentPage);
      },
      (error) => {
        console.log(error)
        this.toastr.error(error.error, 'Error');
      }
    );
  }

  updateStatus(product: Product): void {
    this.editedProduct = { ...product };
    this.editedProduct.status = !this.editedProduct.status;

    this.productService.updateProduct(this.editedProduct).subscribe(
      () => {
        this.toastr.success('Product updated successfully', 'Success');
        this.loadProducts(this.currentPage);
      },
      (error) => {
        console.log(error)
        this.toastr.error(error.error, 'Error');
      }
    );
  }
}
