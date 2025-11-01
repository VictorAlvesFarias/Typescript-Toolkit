
## React Component Selector

A small utility library to create React components that select internal variations (for example: `default`, `primary`, `secondary`) from a components object. The library provides a generic wrapper that makes it easy to build variation-based components without duplicating logic.

Key features
- Generic wrapper using `forwardRef`.
- Named variation support with fallback to `default`.
- TypeScript-friendly generics to compose final component props.

Package name

In this repository's `package.json` the package name is `my-lib` (version 1.0.0). Update `name` and `version` if you publish to npm.

Installation

Install dependencies and build the library locally:

```powershell
npm install
npm run build
```

If published to npm, install with:

```powershell
npm install my-lib
```

Quick start

Simple example — creating a button with variations:

```tsx
import React from 'react'
import { componentSelector } from 'my-lib'

// Variation implementations (can be normal FCs; follow the expected signature)
const DefaultButton = (props: any, ref: any) => (
	<button ref={ref} {...props} />
)

const SecondaryButton = (props: any, ref: any) => (
	<button ref={ref} className="btn-secondary" {...props} />
)

// Create the selector component. A `default` key must exist.
const Button = componentSelector({
	default: DefaultButton,
	secondary: SecondaryButton,
})

// Usage
export default function App() {
	return (
		<div>
			<Button onClick={() => console.log('default')}>Default</Button>
			<Button variation="secondary" onClick={() => console.log('secondary')}>Secondary</Button>
		</div>
	)
}
```

Note: The wrapper uses `forwardRef`, so refs can be forwarded to the returned component.

API

componentSelector<T extends string, K>(
	components: Record<string, any>,
	ommitedKeys?: (keyof (K & { variation?: T; ref?: any; locked?: boolean }))[]
): React.ForwardRefExoticComponent<any>

Parameters
- components: an object where each key is the variation name and the value is the component implementing that variation. The `default` key is required — the function throws if it's missing.
- ommitedKeys: (optional) list of prop keys to omit from the wrapper signature (useful to hide internal props in the wrapper typing).

Behavior
- The returned component reads `props.variation` (string) to decide which variation to render. If not provided, it uses `'default'`.
- If the requested variation does not exist, it falls back to `components.default`.

Errors
- Throws `No default component defined in components.` when no `default` component is provided.

Build

This project contains a build script that runs the TypeScript compiler (see `package.json`):

```powershell
npm run build
```

Build output is expected in the `dist` folder (for example: `dist/index.js`, `dist/index.d.ts`).

Local testing tips

- To test the library within a local project, use `npm link` or import directly from the `src` folder during development.
- Remember to run `npm run build` before consuming the package from another project that imports the `dist` artifacts.

Contributing

Contributions are welcome. Please open issues to report bugs or suggest improvements. For PRs:

1. Fork the repository
2. Create a branch for your feature/bugfix
3. Ensure TypeScript build passes
4. Open a PR from your branch

License

See the `LICENSE` file in the repository for license terms.

---

If you'd like, I can also provide a polished TypeScript example with full typings, an English README with additional sections (changelog, badges), or add a small demo (Storybook or Vite-based) to showcase variations.

