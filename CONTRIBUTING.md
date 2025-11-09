# Contributing to This Project

First off, thank you for considering contributing to this project! 🎉

The following is a set of guidelines for contributing. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Pull Requests](#pull-requests)
- [Development Setup](#development-setup)
- [Style Guidelines](#style-guidelines)
  - [Git Commit Messages](#git-commit-messages)
  - [JavaScript/React Style Guide](#javascriptreact-style-guide)
  - [Python Style Guide](#python-style-guide)
- [Testing](#testing)
- [Documentation](#documentation)

---

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to daviemanuelneymar@gmail.com.

**In short:**
- Be respectful and inclusive
- Be patient and welcoming
- Be considerate and constructive
- Accept constructive criticism gracefully

---

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include as many details as possible:

**Bug Report Template:**

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. Windows 11, macOS 13, Ubuntu 22.04]
- Browser: [e.g. Chrome 120, Firefox 121]
- Node version: [e.g. 18.17.0]
- Python version: [e.g. 3.9.7]

**Additional context**
Add any other context about the problem here.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

**Enhancement Template:**

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request.
```

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our style guidelines
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Ensure tests pass** and code lints successfully
6. **Submit a pull request**

**Pull Request Guidelines:**
- Fill in the required template
- Include relevant issue numbers
- Update documentation as needed
- Add tests for new features
- Ensure all tests pass
- Follow the style guidelines
- Keep pull requests focused on a single concern

---

## Development Setup

### Prerequisites

- **Node.js** 16+ and npm/yarn
- **Python** 3.9+
- **MongoDB** (local or Atlas)
- **Git**

### Setup Steps

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/grilojr09br/Superando-Limites-Website.git
   cd Superando-Limites-Website
   ```

2. **Set up the frontend:**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with your local configuration
   ```

3. **Set up the backend:**
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env with your local configuration
   ```

4. **Start development servers:**
   ```bash
   # Terminal 1: Frontend
   cd frontend
   npm start

   # Terminal 2: Backend
   cd backend
   uvicorn server:app --reload
   ```

5. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000
   - API Docs: http://localhost:8000/docs

---

## Style Guidelines

### Git Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

**Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, missing semicolons, etc)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system or external dependency changes
- `ci`: CI configuration changes
- `chore`: Other changes that don't modify src or test files

**Examples:**
```bash
feat(auth): add JWT authentication

fix(api): resolve CORS issue on production

docs(readme): update installation instructions

refactor(components): simplify button component logic

test(auth): add unit tests for login flow
```

**Rules:**
- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests in the footer

### JavaScript/React Style Guide

- Use **ES6+** features
- Use **functional components** and hooks
- Use **Tailwind CSS** for styling
- Follow **Airbnb JavaScript Style Guide**
- Use **Prettier** for code formatting
- Use **ESLint** for linting

**Code Example:**
```javascript
// Good
const MyComponent = ({ title, onClick }) => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(prev => prev + 1);
    onClick?.();
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold">{title}</h2>
      <button onClick={handleClick}>Count: {count}</button>
    </div>
  );
};
```

**Naming Conventions:**
- Components: `PascalCase` (e.g., `MyComponent.jsx`)
- Files: `PascalCase` for components, `camelCase` for utilities
- Variables/Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- CSS Classes: `kebab-case` (Tailwind classes)

### Python Style Guide

- Follow **PEP 8**
- Use **type hints** where appropriate
- Use **docstrings** for functions and classes
- Use **Black** for code formatting
- Use **Flake8** for linting

**Code Example:**
```python
# Good
from typing import List, Optional

def calculate_total(items: List[float], discount: Optional[float] = None) -> float:
    """
    Calculate total price with optional discount.
    
    Args:
        items: List of item prices
        discount: Optional discount percentage (0-100)
    
    Returns:
        Total price after discount
    """
    total = sum(items)
    if discount:
        total *= (1 - discount / 100)
    return round(total, 2)
```

**Naming Conventions:**
- Functions/Variables: `snake_case`
- Classes: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Private members: `_leading_underscore`

---

## Testing

### Frontend Testing

```bash
cd frontend
npm test                    # Run tests
npm test -- --coverage      # Run with coverage
```

**Test Requirements:**
- Write tests for new features
- Maintain minimum 80% code coverage
- Use React Testing Library
- Test user interactions, not implementation details

**Example:**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from './MyComponent';

test('increments counter on button click', () => {
  render(<MyComponent />);
  const button = screen.getByRole('button');
  fireEvent.click(button);
  expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
});
```

### Backend Testing

```bash
cd backend
pytest                      # Run tests
pytest --cov                # Run with coverage
pytest -v                   # Verbose output
```

**Test Requirements:**
- Write tests for new endpoints
- Maintain minimum 80% code coverage
- Use pytest fixtures
- Test edge cases and error handling

**Example:**
```python
import pytest
from fastapi.testclient import TestClient
from server import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()
```

---

## Documentation

### Code Documentation

- **JavaScript/React**: Use JSDoc comments for complex functions
- **Python**: Use docstrings (Google or NumPy style)
- **Inline comments**: Explain *why*, not *what*

### README Updates

When adding new features, update:
- Main README.md with feature description
- DOCS/INDEX.md if adding new documentation
- Relevant documentation files

### Creating New Documentation

1. Place in `DOCS/` folder
2. Use clear, descriptive filename
3. Add entry to `DOCS/INDEX.md`
4. Use markdown format
5. Include code examples
6. Add table of contents for long docs

---

## Review Process

### Pull Request Review

All submissions require review. We use GitHub pull requests for this purpose.

**Review Checklist:**
- [ ] Code follows style guidelines
- [ ] Tests pass successfully
- [ ] Documentation is updated
- [ ] Commit messages follow convention
- [ ] No merge conflicts
- [ ] Code is properly commented
- [ ] No security vulnerabilities introduced
- [ ] Performance impact is acceptable

### Reviewer Responsibilities

- Be respectful and constructive
- Test the changes locally if possible
- Provide specific feedback
- Approve only if all criteria are met
- Request changes if improvements needed

---

## Questions?

Feel free to:
- Open an issue for discussion
- Ask in pull request comments
- Check existing documentation in `DOCS/`

---

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes for significant contributions
- README acknowledgments section

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

**Thank you for contributing! 🙌**

Together we can make this project even better! 🚀

