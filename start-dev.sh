#!/bin/bash

echo "Starting Spellbook Development Environment..."
echo "============================================"

# Function to kill processes on exit
cleanup() {
    echo -e "\n\nShutting down..."
    kill $API_PID $CLIENT_PID 2>/dev/null
    exit
}

# Set up trap to call cleanup on script exit
trap cleanup EXIT INT TERM

# Start API
echo "Starting API server..."
cd spellbook-api
npm run dev &
API_PID=$!
cd ..

# Wait for API to start
echo "Waiting for API to start..."
sleep 3

# Start Client
echo "Starting client dev server..."
npm run dev &
CLIENT_PID=$!

echo -e "\n============================================"
echo "Development servers started!"
echo "API:    http://localhost:4000/graphql"
echo "Client: https://localhost:3000"
echo "============================================"
echo -e "\nPress Ctrl+C to stop all servers\n"

# Wait for both processes
wait $API_PID $CLIENT_PID