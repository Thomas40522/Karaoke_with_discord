import discord
from discord.ext import commands
from flask import Flask, jsonify
import threading
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()
# Discord bot setup
intents = discord.Intents.default()
intents.message_content = True
discord_bot_key = os.getenv('DISCORD_BOT_KEY')

bot = commands.Bot(command_prefix='!', intents=intents)

queue = []

@bot.event
async def on_ready():
    print(f'Logged in as {bot.user}')

@bot.command()
async def sing(ctx, *, args: str):
    import re
    match = re.match(r'\{(.+?)\}\s+(\S+)', args)
    if match:
        name = match.group(1)
        url = match.group(2)
        queue.append((name, url))
        await ctx.send(f"Added song: **{name}** with URL: {url}")
    else:
        await ctx.send("Invalid format. Use: `!sing {song name} URL`")

# Flask app setup
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

@app.route('/get_queue')
def get_queue():
    return process_queue()

@app.route('/dequeue')
def dequeue():
    queue.pop(0)
    return process_queue()

def process_queue():
    if len(queue) == 0:
        queue.append(("海阔天空", "N6gICr1IVuQ"))
    return jsonify(queue)

# Function to run Flask
def run_flask():
    app.run(host='0.0.0.0', port=3758)

# Start Flask in a new thread
if __name__ == "__main__":
    flask_thread = threading.Thread(target=run_flask)
    flask_thread.start()

    bot.run(discord_bot_key)
