# CodeMetrics

**CodeMetrics** is a comprehensive platform for tracking, predicting, and analyzing coding contests and problem-solving metrics across popular platforms like Codeforces, LeetCode, CodeChef, and GeeksforGeeks (GFG). It provides insights into user performance, predicts rating changes, monitors upcoming events, and even helps detect cheating activities during contests.

## Features

- **Rating Predictor**: Predict future ratings based on past contest performances using machine learning models.
- **Event Tracker**: Stay up-to-date with upcoming coding contests and hackathons from multiple platforms.
- **Question Tracker**: Track your solved, unsolved, and skipped questions across LeetCode, Codeforces, CodeChef, and GFG.
- **Cheater Detection**: Identify suspicious activity in contests by detecting similar submissions and unusual patterns.
- **User Dashboard**: Visualize progress with interactive graphs and statistics on ratings, contest performance, and questions solved.

## Supported Platforms

- **LeetCode**
- **Codeforces**
- **CodeChef**
- **GeeksforGeeks**

## Getting Started

### Prerequisites

- Python 3.x or Node.js (for backend development)
- MongoDB/PostgreSQL for storing user data
- Frontend: React.js (or your choice of framework)
- Docker (optional, for containerized deployment)

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/CodeMetrics.git
    cd CodeMetrics
    ```

2. **Backend Setup** (Python example with Flask):
    - Install dependencies:
      ```bash
      pip install -r requirements.txt
      ```

    - Set up environment variables in a `.env` file:
      ```env
      DATABASE_URL=your_database_url
      SECRET_KEY=your_secret_key
      ```

    - Run the server:
      ```bash
      python app.py
      ```

3. **Frontend Setup** (React example):
    - Navigate to the frontend directory:
      ```bash
      cd frontend
      ```

    - Install dependencies:
      ```bash
      npm install
      ```

    - Start the development server:
      ```bash
      npm start
      ```

4. **Database Setup**:
    - Create the necessary tables/collections for storing user data, contest information, and question progress.
    - For MongoDB, run:
      ```bash
      mongo < setup_db.js
      ```

5. **Run the Application**:
    - Start both the frontend and backend servers.
    - Access the application at `http://localhost:3000` for the frontend and `http://localhost:5000` for the backend.

### Docker Setup (Optional)

If you want to deploy the application using Docker:

1. Build the Docker containers:
    ```bash
    docker-compose build
    ```

2. Start the containers:
    ```bash
    docker-compose up
    ```

The application will be accessible at `http://localhost`.

## Usage

1. **Register/Login**:
    - Sign up with your email or using OAuth (Google, GitHub).
    - Link your coding platform accounts (Codeforces, LeetCode, CodeChef, GFG) by providing your usernames.

2. **Track Your Progress**:
    - Visit the dashboard to view your rating predictions, solved questions, and upcoming contests.

3. **Get Contest Alerts**:
    - Receive notifications or reminders for upcoming coding contests.

4. **Analyze Submissions**:
    - Check for suspicious activity or similar submissions during contests.


## Machine Learning Model

The rating predictor uses a regression model trained on historical contest data from platforms like Codeforces and CodeChef. The model considers various features such as:

- Previous ratings
- Contest ranking
- Number of submissions
- Problem difficulty

For more information, check out the [ML Model Documentation](docs/ML_Model.md).

## Contribution

We welcome contributions! To contribute:

1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature-branch
    ```
3. Make your changes and commit them:
    ```bash
    git commit -m "Add new feature"
    ```
4. Push to the branch:
    ```bash
    git push origin feature-branch
    ```
5. Submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or suggestions, feel free to reach out:

- **Email**: jahnvisahni98@gmail.com
- **GitHub**: [Jahnvi Sahni](https://github.com/jahnvisahni31)

---

**CodeMetrics** - Empowering coders with analytics, predictions, and progress tracking!

