@echo off
chcp 65001 >nul
echo ========================================
echo   Claw Messenger - 推送到GitHub
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] 检查git状态...
git status
echo.

echo [2/3] 推送代码到GitHub...
echo.
git push
echo.

if errorlevel 1 (
    echo.
    echo ❌ 推送失败！
    echo 可能原因：
    echo   1. 网络问题
    echo   2. 需要在浏览器中登录GitHub
    echo   3. 仓库权限问题
    echo.
) else (
    echo.
    echo ✅ 推送成功！
    echo.
    echo 查看仓库：
    echo https://github.com/shealyn010/claw-messenger
    echo.
)

echo ========================================
echo.
pause
