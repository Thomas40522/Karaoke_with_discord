import discord
from discord.ext import commands
from flask import Flask, jsonify, request
import threading
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()
# Discord bot setup
intents = discord.Intents.default()
intents.message_content = True
discord_bot_key = os.getenv('DISCORD_BOT_KEY')

bot = commands.Bot(command_prefix='!', intents=intents, help_command=None)

queue = []
text_to_fire = []
max_song = 20

@bot.event
async def on_ready():
    print(f'Logged in as {bot.user}')

@bot.command()
async def sing(ctx, *, args: str):
    if len(queue) >= max_song:
        await ctx.send(f"{ctx.author.mention}The song queue is full, please wait for a while and try again")
        return
    import re
    match = re.match(r'\{(.+?)\}\s+(\S+)', args)
    if match:
        name = match.group(1)
        url = match.group(2)
        queue.append((name, url))
        await ctx.send(f"{ctx.author.mention} Added song: **{name}** with URL: {url}")
    else:
        await ctx.send(f"{ctx.author.mention} Invalid format. Use: `!sing {{song name}} Youtube URL`")
        
@bot.command()
async def getQueue(ctx):
    if len(queue) < 1:
        await ctx.send("Queue is empty")
    else:
        names = "\n".join(f"{i+1}. {name}" for i, (name, link) in enumerate(queue))
        await ctx.send(names)
        
@bot.command()
async def text(ctx, * args: str):
    message = " ".join(args)
    text_to_fire.append(message)
    await ctx.send(f"{ctx.author.mention} Message recieved!")
    
@bot.command()
async def textName(ctx, * args: str):
    message = " ".join(args)
    message = message + " - " + str(ctx.author)
    text_to_fire.append(message)
    await ctx.send(f"{ctx.author.mention} Message recieved!")
        
@bot.command()
async def help(ctx):
    await ctx.send("To add a song: !sing {song name} Youtube_URL\nTo see all the songs: !getQueue\nTo text to the screen: !text your_message\nTo text with your name: !textName your_message")

# Flask app setup
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://172.16.9.181:3000", "http://publichost:3000"])

@app.route('/get_queue')
def get_queue():
    return process_queue()

@app.route('/dequeue')
def dequeue():
    queue.pop(0)
    return process_queue()

@app.route('/push_to_top', methods=['POST'])
def move_to_front():
    data = request.get_json()
    index = data.get('index')
    if len(queue) == 1 or index == 0:
        return process_queue()

    if index is None or not isinstance(index, int):
        return jsonify({'error': 'Invalid or missing index'}), 400

    if index < 0 or index >= len(queue):
        return jsonify({'error': 'Index out of bounds'}), 400

    item = queue.pop(index)
    if len(queue) < 1:
        queue.insert(0, item)
    else:
        queue.insert(1, item)
    return process_queue()

@app.route('/get_max_song')
def get_max_song():
    return jsonify(max_song)

@app.route('/set_max_song', methods=['POST'])
def set_max_song():
    data = request.get_json()
    max_num = data.get('max_song')
    
    if max_num is None or not isinstance(max_num, int):
        return jsonify({'error': 'Invalid or missing max song number'}), 400
    
    if max_num < 1:
        return jsonify({'error': 'Max number cannot be smaller then 1'}), 400
    
    max_song = max_num

@app.route('/fire_text')
def fire_text():
    if len(text_to_fire) <= 0:
        return jsonify(None)
    else:
        return jsonify(text_to_fire.pop(0))


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
