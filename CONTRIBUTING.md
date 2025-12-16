# Contributing to SmokeSense

Thank you for considering contributing to SmokeSense! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help create a welcoming environment for all contributors

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Device/OS information
   - Screenshots if applicable

### Suggesting Features

1. Check if the feature has been suggested
2. Create a new issue with:
   - Clear use case
   - Expected behavior
   - Potential implementation approach
   - Any design mockups (if UI related)

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes following the style guide
4. Write/update tests
5. Ensure all tests pass: `npm test`
6. Commit with clear messages
7. Push to your fork
8. Create a Pull Request

## Development Setup

1. Clone your fork:
```bash
git clone https://github.com/YOUR_USERNAME/SmokeSense.git
cd SmokeSense
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

4. Run tests:
```bash
npm test
```

## Project Structure

```
SmokeSense/
├── app/                  # Expo Router pages
├── src/
│   ├── components/      # Reusable UI components
│   ├── services/        # Business logic
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
├── assets/              # Images and static files
└── __tests__/           # Test files
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define explicit types, avoid `any`
- Use interfaces for object shapes
- Export types from dedicated type files

### React/React Native

- Use functional components with hooks
- Follow React Native best practices
- Add accessibility labels to interactive elements
- Test components with React Native Testing Library

### Naming Conventions

- **Files**: PascalCase for components, camelCase for utilities
- **Components**: PascalCase
- **Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Interfaces**: PascalCase with descriptive names

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in objects/arrays
- Keep lines under 100 characters when possible
- Use arrow functions

### Comments

- Write self-documenting code
- Add comments for complex logic
- Document public APIs with JSDoc
- Avoid obvious comments

## Testing

### Unit Tests

- Write tests for all services
- Test edge cases and error handling
- Mock external dependencies
- Aim for >80% code coverage

### Component Tests

- Test user interactions
- Test accessibility features
- Test different states (loading, error, success)
- Use testing-library best practices

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Accessibility

- Add `accessibilityLabel` to all interactive elements
- Add `accessibilityHint` for complex interactions
- Use semantic roles (`button`, `checkbox`, etc.)
- Test with screen readers (VoiceOver/TalkBack)
- Ensure touch targets are at least 44x44pt

## Git Commit Messages

Format:
```
type(scope): brief description

Detailed explanation if needed

Closes #issue-number
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(logging): add export to CSV feature

Implements CSV export for cigarette logs with date range filtering.

Closes #42
```

```
fix(budget): handle midnight timezone edge case

Budget was not resetting correctly at midnight in non-UTC timezones.
Now uses local device timezone for day boundaries.

Fixes #38
```

## Documentation

- Update README.md for user-facing changes
- Update SECURITY.md for security-related changes
- Add JSDoc comments for complex functions
- Update this guide for process changes

## Performance

- Avoid unnecessary re-renders
- Optimize database queries
- Use pagination for long lists
- Profile before optimizing

## Security

- Never commit API keys or secrets
- Validate all user inputs
- Use parameterized queries for SQL
- Follow security best practices in SECURITY.md
- Report security issues privately

## Release Process

1. Update version in package.json
2. Update CHANGELOG.md
3. Create release branch: `release/vX.Y.Z`
4. Run full test suite
5. Build and test on iOS/Android
6. Merge to main
7. Tag release: `git tag vX.Y.Z`
8. Push tag: `git push origin vX.Y.Z`

## Questions?

- Open a Discussion for questions
- Join our community (if available)
- Check existing Issues and PRs

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

Thank you for contributing to SmokeSense!
