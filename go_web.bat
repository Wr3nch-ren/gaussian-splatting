rem Initialize Conda
call C:\Users\prayh\miniconda3\Scripts\activate.bat

rem Activate the environment
call conda activate gaussian_splatting

rem Run python script
python ws_server.py
python .\point-cloud-tools\convert.py .\output\point_cloud\iteration_30000\point_cloud.ply .\output\iteration_30000.splat --ply_input_format=inria

rem Run website
.\AutoUI.html

rem Open explorer
explorer .\output\

rem Deactivate the environment
call conda deactivate