@echo off
echo  Checking for Anaconda, Miniconda, or Miniforge installation
set CONDA_PATH=
for %%D in ("%ProgramFiles%\Anaconda3" "%UserProfile%\Anaconda3" "%ProgramFiles%\Miniconda3" "%UserProfile%\Miniconda3" "%ProgramFiles%\Miniforge3" "%UserProfile%\Miniforge3") do (
    if exist "%%D" (
        set CONDA_PATH=%%D
        goto :FOUND_CONDA
    )
)

:FOUND_CONDA
if "%CONDA_PATH%"=="" (
    echo Error: No Anaconda, Miniconda, or Miniforge installation found.
    pause
    exit /b 1
)
echo Conda installation found at: %CONDA_PATH%

REM Suppress output when activating Conda
call %CONDA_PATH%\Scripts\activate.bat >nul 2>&1
if errorlevel 1 (
    echo Error: Failed to activate Conda.
    pause
    exit /b 1
)

echo Check if the gaussian_splatting environment exists
call conda info --envs | findstr gaussian_splatting >nul 2>&1
if errorlevel 1 (
    echo The Conda environment "gaussian_splatting" does not exist.
    echo Creating the environment using environment.yml...
    call conda env create -f environment.yml >nul 2>&1
    if errorlevel 1 (
        echo Error: Failed to create the Conda environment "gaussian_splatting".
        pause
        exit /b 1
    )
    echo Environment "gaussian_splatting" created successfully.
) else (
    echo Conda environment "gaussian_splatting" is already exists.
)

echo Activating the Conda environment "gaussian_splatting"...
call conda activate gaussian_splatting >nul 2>&1
if errorlevel 1 (
    echo Error: Failed to activate the Conda environment "gaussian_splatting".
    pause
    exit /b 1
)
echo Conda environment "gaussian_splatting" activated successfully.

echo Starting html_server.py...
start "" cmd /k python html_server.py
if errorlevel 1 (
    echo Error: Failed to start html_server.py.
    pause
    exit /b 1
)
echo html_server.py started successfully in new terminal.

echo Starting ws_server.py...
start "" cmd /k python ws_server.py
if errorlevel 1 (
    echo Error: Failed to start ws_server.py.
    pause
    exit /b 1
)
echo ws_server.py started successfully in new terminal.

echo Servers started successfully.