# Contributing to Ansopedia User Service

Thank you for your interest in contributing to the Ansopedia User Service! We appreciate your time and effort to make this project better. Please read the guidelines below to help you get started.

## How to Contribute

1. **Fork the Repository**  
   Click on the "Fork" button at the top-right of the repository page to create your copy of the repository.

2. **Clone the Repository**  
   Once you've forked the repository, clone it to your local machine:

   git clone https://github.com/your-username/ansopedia-user-service.git

3. **Create a Branch**  

Create a new branch for your feature, bug fix, or documentation update:
git checkout -b feature/your-feature-name

Use the following naming conventions for your branches:

Feature branch: feature/your-feature-name
Bug fix branch: bugfix/your-bug-name
Documentation branch: docs/update-name

4. **Make Changes**
Make sure to follow the code style and formatting guidelines below when making changes.

5. **Commit Your Changes**
After making your changes, commit them with a descriptive commit message:
git commit -m "Add new feature for user registration"

6. **Push to Your Fork**
Push your changes to your forked repository:
git push origin feature/your-feature-name

7. **Create a Pull Request (PR)**
Go to the original repository and click on the "New Pull Request" button. Provide a clear description of your changes in the PR description. Link the issue you are addressing, if applicable.

8. **Wait for Review**
The maintainers will review your PR and may suggest changes. Once approved, your PR will be merged.


**Code Formatting and Style Guide**

We use Prettier for code formatting. Run the following to check or fix formatting issues:
Check: pnpm prettier:check
Fix: pnpm prettier:fix

We use ESLint for linting. To check and fix lint issues:
Check: pnpm lint
Fix: pnpm lint:fix

Ensure that your code adheres to the existing coding standards and passes all tests before submitting a pull request.
