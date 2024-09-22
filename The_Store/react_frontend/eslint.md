# Coding Standards and ESLint Rules

## Why are Coding Standards Important?

1. **Code Quality and Maintainability**:

   - Rules like `react/jsx-no-duplicate-props`, `react-hooks/rules-of-hooks`, and `camelcase` ensure clear, consistent, and less error-prone code.
   - They maintain a standard coding convention, making the codebase easier to understand and maintain.

2. **Performance Optimization**:

   - Rules such as `react-perf/jsx-no-new-function-as-prop`, `react-perf/jsx-no-new-array-as-prop`, and `react-perf/jsx-no-new-object-as-prop` optimize React application performance.
   - They discourage practices leading to unnecessary re-renders, ensuring efficient and responsive components.

3. **React Best Practices**:

   - Rules like `react/jsx-key`, `react/no-array-index-key`, and `react/no-unused-state` emphasize React-specific best practices.
   - They guide correct usage of React features, essential for predictable component behavior.

4. **Accessibility and Inclusivity**:

   - The `jsx-a11y/alt-text` rule ensures web content accessibility for all users, including those using screen readers.

5. **Modern JavaScript Standards**:

   - Rules like `prefer-const` and `no-var` promote the use of modern JavaScript features and best practices.

6. **UI Consistency and Readability**:
   - `react/jsx-pascal-case` and `react/self-closing-comp` enhance UI code consistency and readability.

Adhering to these rules improves code quality and aligns with industry standards, preparing for professional development environments.

## Ruleset-specific Errors

- `react/jsx-key`: Ensures elements in a list have a `key` prop for React's reconciliation process.
- `react/no-array-index-key`: Prevents using array indices as keys in lists, avoiding unnecessary or incorrect renders.
- `react/jsx-no-duplicate-props`: Disallows duplicate props on JSX elements to prevent unpredictable behavior.
- `react-perf/jsx-no-new-function-as-prop`: Avoids passing new function instances as props to prevent unnecessary re-renders.
- `react-perf/jsx-no-new-array-as-prop`: Warns against creating new array instances in JSX props.
- `react-perf/jsx-no-new-object-as-prop`: Prevents passing new object instances as props.
- `react/no-unescaped-entities`: Avoids potential issues with displaying text in JSX.
- `react-hooks/rules-of-hooks`: Ensures adherence to the Rules of Hooks in React.
- `react/jsx-pascal-case`: Enforces PascalCase for component names.
- `prefer-const`: Encourages using `const` for unchanging variables.
- `camelcase`: Enforces camelCase naming convention.
- `no-var`: Disallows the use of the `var` keyword, promoting `let` and `const`.

## Ruleset-specific Warnings (does not affect grade)

- `react/jsx-props-no-spreading`: Discourages prop spreading in JSX.
- `react/button-has-type`: Ensures button elements have an explicit `type` attribute.
- `react/self-closing-comp`: Encourages self-closing tags for components without children.
- `react/jsx-fragments`: Enforces consistent fragment syntax.
- `react/jsx-no-useless-fragment`: Warns against unnecessary fragments.
- `react/no-unused-state`: Warns against unused state variables.
- `react-hooks/exhaustive-deps`: Ensures all dependencies are listed in hooks.
- `jsx-a11y/alt-text`: Ensures images have alternative text.
- `no-unused-vars`: Warns against unused variables.
- `max-lines-per-function`: Enforces a maximum number of lines per function.

---

_Note: Following these guidelines not only elevates the quality of your project but also ingrains industry-standard practices vital for your development career._

# How to run ESLint in Project

1. **Install new dependencies**:

   - Package.json file contains the required dependencies for ESLint. Run the following command to install them:

     ```bash
     npm install
     ```

2. **Run ESLint**:

   - Run the following command to execute ESLint and check for any errors or warnings:

     ```bash
     npm run lint
     ```

   - If there are any errors or warnings, ESLint will display them in the terminal.
