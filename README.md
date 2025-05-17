# Virtual Hug

 A secure, end-to-end encrypted messaging web application allowing users to send virtual hugs as GIFs. Messages are encrypted in the browser and encoded in the URL hash, so no server or database is required.

 ## Live Demo

 <!-- Add your deployment link here -->

 http://localhost:8080

 ## Features

 - Compose a hug message with recipient name, custom message, and GIF.
 - End-to-end encryption: message data is encrypted in the browser using the Web Crypto API.
 - Zero backend: messages delivered via URL hash.
 - Responsive UI built with shadcn-ui and Tailwind CSS.

 ## Tech Stack

 - Vite
 - React
 - TypeScript
 - Tailwind CSS
 - shadcn-ui
 - Radix UI
 - React Query
 - React Router
 - Sonner (toast notifications)

 ## Prerequisites

 - Node.js v18.x or later
 - npm v8.x or later

 ## Getting Started

 1. Clone the repository:

    ```bash
    git clone <YOUR_REPO_URL>
    cd <PROJECT_FOLDER>
    ```

 2. Install dependencies:

    ```bash
    npm install
    ```

 3. Run the development server:

    ```bash
    npm run dev
    ```

 4. Open your browser and navigate to:

    ```
    http://localhost:8080
    ```

 ## Building for Production

 To build the application for production:

 ```bash
 npm run build
 ```

 The output will be located in the `dist` directory.

 To preview the production build locally:

 ```bash
 npm run preview
 ```

 ## Directory Structure

 ```
 .
 ├── public/              # Static assets
 ├── src/
 │   ├── components/      # Reusable UI components (MessageForm, GifCarousel, etc.)
 │   ├── pages/           # Application pages (Index, View)
 │   ├── utils/           # Utility functions (encryption, parsing)
 │   └── main.tsx         # Application entry point
 ├── tailwind.config.ts   # Tailwind CSS configuration
 ├── vite.config.ts       # Vite configuration
 ├── package.json         # Project metadata and scripts
 └── README.md            # Project documentation
 ```

 ## Contributing

 Contributions are welcome! Feel free to open issues or submit pull requests.

 ## License

This project is private.

---

© 2020 Ebinesh. Check out my profile on [LinkedIn](https://www.linkedin.com/in/ebinesh/).