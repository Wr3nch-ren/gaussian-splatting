rem Initialize Conda
call C:\Users\prayh\miniconda3\Scripts\activate.bat

rem Activate the environment
call conda activate gaussian_splatting

rem Run html server and website
start "" /B python html_server.py

rem Run websocket server
start "" /B python ws_server.py