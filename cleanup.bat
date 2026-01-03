@echo off
echo Cleaning up unnecessary documentation files...
del /F /Q "INSTALL_NODEMAILER.md" 2>nul
del /F /Q "CREDENTIALS_SYSTEM_DOCS.md" 2>nul
del /F /Q "install-credentials-system.ps1" 2>nul
del /F /Q "INTEGRATION_COMPARISON.md" 2>nul
del /F /Q "SERVER_API_DOCUMENTATION.md" 2>nul
del /F /Q "CLIENT_FEATURES_DOCUMENTATION.md" 2>nul
del /F /Q "FIXES_COMPLETED.md" 2>nul
del /F /Q "TEST_RESULTS.md" 2>nul
del /F /Q "API_QUICK_REFERENCE.md" 2>nul
del /F /Q "server\TEST_RESULTS.md" 2>nul
echo Done! Project cleaned up.
pause
