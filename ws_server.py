import asyncio
import websockets
import base64
import json
import subprocess
import sys
import os


def save_file(file_path, file_content):
    with open(file_path, "wb") as f:
        f.write(file_content)

session_data = []

async def handle_client(websocket):
    try:
        async for message in websocket:
            
            data = json.loads(message)
            response = {"status": "error", "message": "Invalid request type."}

            # Send the respond
            await websocket.send(json.dumps(response))
            print("MESSAGE SEND: ", response)

    except websockets.ConnectionClosed as e:
        print(f"Connection closed: {e}")

async def main():
    server = await websockets.serve(handle_client, "127.0.0.1", 7444, max_size=10 * 1024 * 1024)
    print("[*] WebSocket server running on ws://127.0.0.1:7444")
    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())