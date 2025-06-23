#!/bin/bash
# 🔍 MovieMind AI - Pre-Commit Debug & Verification Checklist

echo "🔍 STARTING COMPREHENSIVE PROJECT DEBUG CHECK..."
echo "=================================================="

# 1. Check if all critical files exist
echo ""
echo "📁 CHECKING CRITICAL FILES..."
echo "--------------------------------"

check_file() {
    if [ -f "$1" ]; then
        echo "✅ $1 exists"
    else
        echo "❌ $1 MISSING"
    fi
}

# Critical configuration files
check_file ".env"
check_file ".env.example"
check_file "package.json"
check_file "tsconfig.json"
check_file "tsconfig.app.json"
check_file "vite.config.ts"
check_file "tailwind.config.js"

# Main app files
check_file "src/App.tsx"
check_file "src/main.tsx"
check_file "src/index.css"

# 2. TypeScript compilation check
echo ""
echo "🔧 TYPESCRIPT COMPILATION CHECK..."
echo "-----------------------------------"
npm run type-check
if [ $? -eq 0 ]; then
    echo "✅ TypeScript compilation successful"
else
    echo "❌ TypeScript compilation errors found"
fi

# 3. ESLint check
echo ""
echo "📝 ESLINT CHECK..."
echo "-------------------"
npm run lint --silent
if [ $? -eq 0 ]; then
    echo "✅ ESLint passed - no issues found"
else
    echo "⚠️ ESLint found issues (run 'npm run lint:fix' to auto-fix)"
fi

# 4. Check if project builds
echo ""
echo "🏗️ BUILD CHECK..."
echo "------------------"
npm run build --silent
if [ $? -eq 0 ]; then
    echo "✅ Project builds successfully"
    # Check build output size
    if [ -d "dist" ]; then
        BUILD_SIZE=$(du -sh dist | cut -f1)
        echo "📦 Build size: $BUILD_SIZE"
    fi
else
    echo "❌ Build failed"
fi

# 5. Check for missing dependencies
echo ""
echo "📦 DEPENDENCY CHECK..."
echo "-----------------------"
npm ls --depth=0 --silent 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ All dependencies installed correctly"
else
    echo "⚠️ Some dependencies may be missing"
    echo "Run 'npm install' to fix"
fi

# 6. Check environment variables
echo ""
echo "🔐 ENVIRONMENT VARIABLES CHECK..."
echo "----------------------------------"
if [ -f ".env" ]; then
    if grep -q "your_tmdb_api_key_here" .env; then
        echo "⚠️ TMDB API key not configured (still using placeholder)"
    else
        echo "✅ TMDB API key configured"
    fi
    
    if grep -q "your_omdb_api_key_here" .env; then
        echo "⚠️ OMDB API key not configured (still using placeholder)"
    else
        echo "✅ OMDB API key configured"
    fi
else
    echo "❌ .env file missing"
fi

# 7. Check git status
echo ""
echo "📋 GIT STATUS..."
echo "-----------------"
git status --porcelain | head -10
UNTRACKED=$(git status --porcelain | wc -l)
echo "📊 Files changed/untracked: $UNTRACKED"

# 8. Count files created
echo ""
echo "📊 PROJECT STATISTICS..."
echo "-------------------------"
TS_FILES=$(find src -name "*.ts" -o -name "*.tsx" | wc -l)
COMPONENT_FILES=$(find src/components -name "*.tsx" | wc -l)
HOOK_FILES=$(find src/hooks -name "*.ts" | wc -l)
PAGE_FILES=$(find src/pages -name "*.tsx" | wc -l)
FEATURE_FILES=$(find src/features -name "*.tsx" | wc -l)

echo "📁 TypeScript files: $TS_FILES"
echo "🧩 React components: $COMPONENT_FILES"
echo "🪝 Custom hooks: $HOOK_FILES"
echo "📄 Page components: $PAGE_FILES"
echo "⭐ Feature components: $FEATURE_FILES"

# 9. Check for red blinking files (empty imports)
echo ""
echo "🔴 CHECKING FOR EMPTY FILES (Red Blinking)..."
echo "----------------------------------------------"
EMPTY_TS_FILES=$(find src -name "*.ts" -o -name "*.tsx" | xargs wc -l | awk '$1 == 0 {print $2}')
if [ -z "$EMPTY_TS_FILES" ]; then
    echo "✅ No completely empty TypeScript files found"
else
    echo "⚠️ Empty files found:"
    echo "$EMPTY_TS_FILES"
fi

# 10. Development server test
echo ""
echo "🚀 DEVELOPMENT SERVER TEST..."
echo "------------------------------"
echo "ℹ️ To test the dev server manually, run: npm run dev"
echo "ℹ️ Server should start on http://localhost:3000"

# 11. Final recommendations
echo ""
echo "💡 FINAL RECOMMENDATIONS..."
echo "----------------------------"
echo "1. 🔑 Add your real API keys to .env file"
echo "2. 🧪 Test the app manually: npm run dev"
echo "3. 🔍 Check the browser console for errors"
echo "4. 📱 Test responsive design on mobile"
echo "5. ✅ If all looks good, proceed with commit!"

echo ""
echo "🎯 READY FOR COMMIT CHECKLIST:"
echo "--------------------------------"
echo "[ ] TypeScript compiles without errors"
echo "[ ] ESLint passes (or only minor warnings)"
echo "[ ] Project builds successfully"
echo "[ ] .env file exists (even with placeholders)"
echo "[ ] Manual testing shows app works"
echo "[ ] No critical red blinking files"
echo ""
echo "If all above are checked, you're ready to commit! 🚀"

# Bonus: API key reminder
echo ""
echo "🎬 API KEYS REMINDER:"
echo "----------------------"
echo "TMDB: https://www.themoviedb.org/settings/api"
echo "OMDB: http://www.omdbapi.com/apikey.aspx"
echo ""
echo "🎉 Debug check complete!"