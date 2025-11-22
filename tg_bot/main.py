import os
import logging
from datetime import datetime
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
import gspread
from google.oauth2.service_account import Credentials
from dotenv import load_dotenv


load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
GOOGLE_SHEET_NAME = os.getenv('GOOGLE_SHEET_NAME')
CREDENTIALS_FILE = os.getenv('GOOGLE_CREDENTIALS_PATH')


def get_sheets_client():
    scope = [
        'https://spreadsheets.google.com/feeds',
        'https://www.googleapis.com/auth/drive'
    ]
    creds = Credentials.from_service_account_file(CREDENTIALS_FILE, scopes=scope)
    return gspread.authorize(creds)

def parse_workout(text):
    """
    Parse workout text like "squat 3*10*90+2*3*100 lunges"
    Returns formatted string with timestamp
    """
    # more friendly formatting
    text = text.replace(':', '*').replace('-', ' + ')
    return text

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Send a message when the command /help is issued."""
    await update.message.reply_text(
        'Log workout in the following format: squat 3*10*90+2*3*100 lunges\n'
        'It will be saved to Google Sheet'
    )

async def log_workout(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Log workout message to Google Sheets."""
    try:
        formatted_text = parse_workout(update.message.text)
        
        client = get_sheets_client()
        spreadsheet = client.open(GOOGLE_SHEET_NAME)
        sheet = spreadsheet.get_worksheet(0)

        sheet.append_row([datetime.now().strftime('%Y-%m-%d %H:%M:%S'), formatted_text])
        
        await update.message.reply_text('Done')
        logger.info(f"Logged workout: {formatted_text}")
        
    except Exception as e:
        logger.error(f"Error logging workout: {e}")
        await update.message.reply_text(f'❌ {str(e)}')

async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Should log errors not related to this code"""
    logger.error(f'Update {update} caused error {context.error}')

def main():
    
    application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, log_workout))
    application.add_error_handler(error_handler)

    application.run_polling()

if __name__ == '__main__':
    main()
