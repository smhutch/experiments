# Experiments

## Structure

- `mgmt/*`: utils to scaffold new experiments
- `packages/*`: experiments

## Scripts

```bash
# Create a new experiment
yarn scaffold
```

## Package scripts

```bash
# Run dev server
yarn workspace {package} dev

# Build for production
yarn workspace {package} build

# Run production build
yarn workspace {package} start
```
