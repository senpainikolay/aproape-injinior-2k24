from app import create_app
from dotenv import load_dotenv
import os
load_dotenv()

if __name__ == "__main__":
    create_app().run( host='0.0.0.0', port=os.environ.get("PORT"))


