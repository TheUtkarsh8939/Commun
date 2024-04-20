$param1=$args[0]
git add .
git commit -m "$param1"
git push origin main
npm run build
npx firebase deploy --only hosting