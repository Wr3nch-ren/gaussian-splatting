import asyncio
import websockets
import base64
import json
import subprocess
import sys
import os

import autorun


def save_file(file_path, file_content):
    with open(file_path, "wb") as f:
        f.write(file_content)

session_data = []

async def handle_client(websocket):
    try:
        async for message in websocket:
            
            data = json.loads(message)
            response = {"status": "error", "message": "Invalid request type."}

            if data["action"] == "select_zip":
                # Calls imageprocessor.py to handle the response
                autorun.run_imageprocessor()
                # Check if the response is successful
                response = {"status": "success", "message": "ZIP file selection is working properly."}
            
            if data["action"] == "convert_data":
                # Calls autorun.py to handle the conversion
                autorun.run_convert_script()
                # Check if the response is successful
                response = {"status": "success", "message": "Convert to Point Cloud completed successfully."}
            
            if data["action"] == "train_data":
                if data["local_mode"] == "false":
                    # Change the local_mode inside autorun.py to "false"
                    autorun.local_mode = False  
                else:
                    # Change the local_mode inside autorun.py to "true"
                    autorun.local_mode = True
                    if data["training_mode"] == "cuda":
                        autorun.training_mode = "cuda" 
                    if data["training_mode"] == "cpu":
                        autorun.training_mode = "cpu"
                autorun.run_train_script()
                response = {"status": "success", "message": "Training completed successfully."}
            
            if data["action"] == "run_visualizer":
                if data["renderer_mode"] == "executable":
                    autorun.renderer_mode = "executable"
                else:
                    autorun.renderer_mode = "web"
                # Calls autorun.py to handle the visualization
                autorun.run_visualizer()
                # Check if the response is successful
                response = {"status": "success", "message": "Visualization completed successfully."}
            
            if data["action"] == "run_all":
                if data["local_mode"] == "false":
                    # Change the local_mode inside autorun.py to "false"
                    autorun.local_mode = False  
                else:
                    # Change the local_mode inside autorun.py to "true"
                    autorun.local_mode = True
                    if data["training_mode"] == "cuda":
                        autorun.training_mode = "cuda" 
                    if data["training_mode"] == "cpu":
                        autorun.training_mode = "cpu"
                if data["renderer_mode"] == "executable":
                    autorun.renderer_mode = "executable"
                else:
                    autorun.renderer_mode = "web"
                autorun.autorun()
                response = {"status": "success", "message": "All processes completed successfully."}

            # Send the respond
            await websocket.send(json.dumps(response))
            print("MESSAGE SEND: ", response)

    except websockets.ConnectionClosed as e:
        print(f"Connection closed: {e}")
    finally:
        # Clean up session data
        session_data.clear()
        print("Session data cleared.")
        print("Connection closed cleanly.")

async def main():
    server = await websockets.serve(handle_client, "127.0.0.1", 7444, max_size=10 * 1024 * 1024)
    print("[*] WebSocket server running on ws://127.0.0.1:7444")
    await server.wait_closed()

if __name__ == "__main__":
    asyncio.get_event_loop().run_until_complete(main())
    asyncio.get_event_loop().run_forever()