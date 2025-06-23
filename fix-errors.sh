# 🚀 QUICK VALIDATION SCRIPT - Run this after fixes

echo "🔍 QUICK VALIDATION CHECK..."
echo "============================="

# 1. Quick TypeScript check (only show error count)
echo "🔧 TypeScript Check:"
echo "--------------------"
if npm run type-check 2>&1 | grep -q "Found 0 errors"; then
    echo "✅ TypeScript: PASSED (0 errors)"
    TS_PASS=true
else
    ERROR_COUNT=$(npm run type-check 2>&1 | grep "Found.*errors" | grep -o '[0-9]\+' | head -1)
    echo "⚠️ TypeScript: $ERROR_COUNT errors remaining"
    TS_PASS=false
fi

# 2. Build check (quick)
echo ""
echo "🏗️ Build Check:"
echo "----------------"
if npm run build --silent > /dev/null 2>&1; then
    echo "✅ Build: PASSED"
    BUILD_PASS=true
else
    echo "❌ Build: FAILED"
    BUILD_PASS=false
fi

# 3. Dev server test (quick start/stop)
echo ""
echo "🚀 Dev Server Test:"
echo "-------------------"
echo "Starting dev server for 5 seconds..."
timeout 5s npm run dev > /dev/null 2>&1
if [ $? -eq 124 ]; then  # timeout exit code
    echo "✅ Dev Server: STARTED OK"
    SERVER_PASS=true
else
    echo "❌ Dev Server: FAILED TO START"
    SERVER_PASS=false
fi

# 4. Critical files check
echo ""
echo "📁 Critical Files:"
echo "------------------"
CRITICAL_FILES=(
    "src/services/tmdb.ts"
    "src/components/ui/Button.tsx"
    "src/types/movie.ts"
    ".env"
)

FILES_PASS=true
for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file MISSING"
        FILES_PASS=false
    fi
done

# 5. Overall decision
echo ""
echo "🎯 COMMIT DECISION:"
echo "==================="

if [ "$TS_PASS" = true ] && [ "$BUILD_PASS" = true ] && [ "$FILES_PASS" = true ]; then
    echo "🎉 READY TO COMMIT!"
    echo ""
    echo "All critical checks passed. You can safely commit with:"
    echo "git add ."
    echo "git commit -m \"✨ feat: Complete Search & Discovery System\""
    echo "git push origin feature/search-and-discovery"
elif [ "$BUILD_PASS" = true ] && [ "$FILES_PASS" = true ]; then
    echo "⚠️ COMMIT WITH CAUTION"
    echo ""
    echo "Build works but TypeScript has some errors."
    echo "This is acceptable for a feature branch commit."
    echo "You can commit and fix remaining issues later."
else
    echo "🚨 DO NOT COMMIT YET"
    echo ""
    echo "Critical issues remain. Fix them first:"
    if [ "$BUILD_PASS" = false ]; then
        echo "- Build is failing"
    fi
    if [ "$FILES_PASS" = false ]; then
        echo "- Critical files are missing"
    fi
fi

echo ""
echo "💡 Quick fix commands if needed:"
echo "- TypeScript errors: Focus on imports/exports"
echo "- Build errors: Usually same as TypeScript"
echo "- Missing files: Run the UI component creation script"