#!/bin/bash

# release.sh — Nexicore-style release hygiene for npm packages

set -e
 
if ! command -v pnpm &> /dev/null; then
    echo "ℹ️ pnpm not found. Installing it globally with npm..."
    npm install -g pnpm
    echo "✅ pnpm installed successfully."
fi

VERSION=$1

if [ -z "$VERSION" ]; then
  echo "❌ No version specified. Usage: ./release.sh v1.1.0"
  exit 1
fi

echo "🔍 Checking for uncommitted changes..."
if [[ -n $(git status --porcelain) ]]; then
  echo "❌ Uncommitted changes detected. Please commit or stash before releasing."
  exit 1
fi

echo "📦 Verifying package.json version..."
PKG_VERSION=$(node -p "require('./package.json').version")
if [[ "$PKG_VERSION" != "${VERSION#v}" ]]; then
  echo "❌ package.json version ($PKG_VERSION) does not match tag version (${VERSION#v})"
  exit 1
fi

echo "📝 Verifying changelog..."
if ! grep -q "$VERSION" CHANGELOG.md; then
  echo "❌ CHANGELOG.md does not contain $VERSION"
  exit 1
fi

echo "✅ All checks passed. Tagging release..."
git tag "$VERSION"
git push origin "$VERSION"

echo "🛠 Building package..."
pnpm build

echo "🔐 Verifying npm login status..."
if ! npm whoami > /dev/null 2>&1; then
  echo "ℹ️ You are not logged into npm. Please follow the prompts to log in."
  npm adduser
  if ! npm whoami > /dev/null 2>&1; then
    echo "❌ npm login failed. Please try again."
    exit 1
  fi
fi

LOGGED_IN_USER=$(npm whoami)
echo "✅ Logged in as '$LOGGED_IN_USER'."

echo "� Ready to publish to npm"
read -p "Publish to npm now? (y/N): " CONFIRM
if [[ "$CONFIRM" == "y" || "$CONFIRM" == "Y" ]]; then
  pnpm publish --access public
  echo "🎉 Published $VERSION to npm"
else
  echo "🛑 Skipped npm publish"
fi
