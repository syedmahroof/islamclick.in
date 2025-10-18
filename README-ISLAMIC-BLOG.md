# Islamic Blog

A modern, responsive Islamic blog built with Laravel, React, and Tailwind CSS. This platform serves as a comprehensive resource for authentic Islamic knowledge, covering various topics including Aqeedah, Fiqh, Seerah, Tafseer, and more.

## Features

- **Responsive Design**: Fully responsive layout that works on all devices
- **Modern UI**: Clean, accessible, and user-friendly interface
- **Rich Content**: Support for articles, categories, tags, and multimedia
- **Search Functionality**: Powerful search across all content
- **Social Sharing**: Easy sharing of articles on social media
- **SEO Optimized**: Built with search engine optimization in mind
- **Performance**: Optimized for fast loading and smooth user experience

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Inertia.js
- **Backend**: Laravel, PHP
- **Database**: MySQL/PostgreSQL
- **Authentication**: Laravel Sanctum
- **Deployment**: Vite, Laravel Forge/Envoyer

## Getting Started

### Prerequisites

- PHP 8.1+
- Node.js 16+
- Composer
- MySQL/PostgreSQL

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd islamic-blog
   ```

2. Install PHP dependencies:
   ```bash
   composer install
   ```

3. Install JavaScript dependencies:
   ```bash
   npm install
   ```

4. Create a copy of the .env file:
   ```bash
   cp .env.example .env
   ```

5. Generate application key:
   ```bash
   php artisan key:generate
   ```

6. Configure your database in the `.env` file:
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=islamic_blog
   DB_USERNAME=root
   DB_PASSWORD=
   ```

7. Run database migrations and seeders:
   ```bash
   php artisan migrate --seed
   ```

8. Build assets:
   ```bash
   npm run dev
   # or for production
   npm run build
   ```

9. Start the development server:
   ```bash
   php artisan serve
   ```

10. Visit the application in your browser:
    ```
    http://localhost:8000
    ```

## Project Structure

```
islamic-blog/
├── app/                    # Laravel application code
├── bootstrap/              # Application bootstrap files
├── config/                 # Configuration files
├── database/               # Database migrations and seeders
├── public/                 # Publicly accessible files
├── resources/
│   ├── js/                 # JavaScript/TypeScript source files
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   └── app.tsx         # Main application entry point
│   └── views/              # Blade templates
├── routes/                 # Application routes
├── storage/                # Storage for uploads, cache, etc.
└── tests/                  # Test files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open-source and available under the [MIT License](LICENSE).

## Contact

For any questions or suggestions, please open an issue or contact us at [your-email@example.com](mailto:your-email@example.com).

## Acknowledgments

- [Laravel](https://laravel.com/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Inertia.js](https://inertiajs.com/)
- [Heroicons](https://heroicons.com/)

---

<p align="center">Made with ❤️ for the Ummah</p>
