# MNZL Movies

Welcome to the MNZL Movies project! This project allows users to create and share movie lists, using the MovieDB API. Built using the MERN stack, it features full CRUD operations for user lists and MovieDB searches.

## Features

- 🔒 **JWT Authentication**: Secure user authentication.
- 📝 **Signup & Login**: User registration and login functionalities.
- 📃 **Full CRUD**: Create, Read, Update, and Delete operations for user movie lists.
- 🔍 **MovieDB Search**: Search movies using the MovieDB API.

## Getting Started

### Prerequisites

Before you start, ensure you have the following:

- [MovieDB API Key](https://developer.themoviedb.org/docs/getting-started)
- Docker installed on your machine

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/0x0645/mnzl
    cd mnzl
    ```

2. **Setup Backend:**

    ```bash
    cd backend
    cp .env.template .env
    ```

    Edit the `.env` file and replace `MOVIE_DB_API_KEY` with your MovieDB API key.

3. **Setup Frontend:**

    ```bash
    cd frontend
    cp .env.template .env
    ```

4. **Launch the application:**

    ```bash
    docker-compose up -d
    ```

    The backend will be available at `http://localhost:8080` and the frontend at `http://localhost:8000`.

## Note

If the database doesn't start for some reason, which happened with me once with the Docker version, delete the volume and try again.

## API Documentation

Explore the API using the Postman collection provided below:

[Postman Collection for MNZL Movies API](https://www.postman.com/red-shuttle-467151/workspace/mnzl-movies/collection/23296523-2c8f9d7d-1266-4bce-a654-f521d4ce2e85?action=share&creator=23296523)


## License

This project is licensed under the MIT License.

