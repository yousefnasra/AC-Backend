# AC Backend

AC Backend is a Node.js-based e-commerce application backend that provides APIs for managing users, products, categories, brands, orders, carts, coupons, reviews, and wishlists. It is built using Express.js and MongoDB.

---

## Features

- **Authentication**: User registration, login, account activation, password reset.
- **Authorization**: Role-based access control (user/admin).
- **Product Management**: Create, update, delete, and retrieve products.
- **Category Management**: Create, update, delete, and retrieve categories.
- **Brand Management**: Create, update, delete, and retrieve brands.
- **Cart Management**: Add, update, remove products in the cart.
- **Wishlist Management**: Add, remove products in the wishlist.
- **Order Management**: Create, cancel orders, and manage stock.
- **Coupon Management**: Create, update, delete, and retrieve coupons.
- **Review Management**: Add and update product reviews.
- **Stripe Integration**: Payment gateway for orders.
- **Cloudinary Integration**: Image upload and management.
- **PDF Invoice Generation**: Generate invoices for orders.

---

## Project Structure

```
AC Backend/
├── .env
├── .gitignore
├── index.js
├── package.json
├── README.md
├── vercel.json
├── DB/
│   ├── connection.js
│   └── models/
│       ├── brand.model.js
│       ├── cart.model.js
│       ├── category.model.js
│       ├── coupon.model.js
│       ├── order.model.js
│       ├── product.model.js
│       ├── review.model.js
│       ├── token.model.js
│       ├── user.model.js
│       └── wishlist.model.js
├── src/
│   ├── middleware/
│   │   ├── authentication.middleware.js
│   │   ├── authorization.middleware.js
│   │   └── validation.middleware.js
│   ├── modules/
│   │   ├── auth/
│   │   ├── brand/
│   │   ├── cart/
│   │   ├── category/
│   │   ├── coupon/
│   │   ├── order/
│   │   ├── product/
│   │   ├── review/
│   │   └── wishlist/
│   └── utils/
│       ├── asyncHandler.js
│       ├── cloud.js
│       ├── fileUpload.js
│       ├── htmlTemplates.js
│       ├── pdfInvoice.js
│       └── sendEmails.js

```

## API Endpoints

### Authentication
- `POST /auth/register`: Register a new user.
- `GET /auth/activate_account/:token`: Activate user account.
- `POST /auth/login`: Login user.
- `PATCH /auth/forgetCode`: Send password reset code.
- `PATCH /auth/resetPassword`: Reset password.

### Categories
- `POST /category`: Create a category.
- `PATCH /category/:id`: Update a category.
- `DELETE /category/:id`: Delete a category.
- `GET /category`: Get all categories.

### Brands
- `POST /brand`: Create a brand.
- `PATCH /brand/:id`: Update a brand.
- `DELETE /brand/:id`: Delete a brand.
- `GET /brand`: Get all brands.

### Products
- `POST /product`: Create a product.
- `DELETE /product/:id`: Delete a product.
- `GET /product`: Get all products.
- `GET /product/:id`: Get a product by ID.

### Cart
- `POST /cart`: Add product to cart.
- `PATCH /cart`: Update product quantity in cart.
- `PATCH /cart/:productId`: Remove product from cart.
- `PUT /cart`: Clear cart.
- `GET /cart`: Get user cart.

### Wishlist
- `POST /wishlist`: Add product to wishlist.
- `PATCH /wishlist/:productId`: Remove product from wishlist.
- `GET /wishlist`: Get user wishlist.

### Orders
- `POST /order`: Create an order.
- `PATCH /order/:id`: Cancel an order.
- `POST /order/webhook`: Stripe webhook endpoint for handling payment events.
- `GET /order`: Get user orders.
- `GET /order/allorders`: Get all orders (admin only).

### Coupons
- `POST /coupon`: Create a coupon.
- `PATCH /coupon/:code`: Update a coupon.
- `DELETE /coupon/:code`: Delete a coupon.
- `GET /coupon`: Get all coupons.

### Reviews
- `POST /product/:productId/review`: Add a review.
- `PATCH /product/:productId/review/:id`: Update a review.

---

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT
- **File Uploads**: Multer, Cloudinary
- **Stripe**: Payment gateway.
- **PDFKit**: PDF generation.
- **Email Service**: Nodemailer
- **Validation**: Joi
- **Utilities**: Moment.js, Randomstring
- **Security**:
  - Rate limiting using `express-rate-limit` to prevent abuse.
  - CORS for cross-origin resource sharing.

---

## Contact Information

For questions or support, please contact:

- **Email**: [yosefnasra96@gmail.com](mailto:yosefnasra96@gmail.com)
- **GitHub**: [yousefnasra](https://github.com/yousefnasra)